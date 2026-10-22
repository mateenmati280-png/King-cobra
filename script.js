/* ============================================================
   KING COBRA — FIREBASE AUTH SCRIPT (Email Based Referral)
   ============================================================ */
import {
    db, auth, doc, setDoc, getDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from './firebase-config.js';

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg){
    var t = document.getElementById('toast');
    if(!t){ alert(msg); return; }
    t.innerText = msg;
    t.classList.add('show');
    if(window.tt) clearTimeout(window.tt);
    window.tt = setTimeout(function(){ t.classList.remove('show'); }, 2500);
}
window.showToast = showToast;

/* ============================================================
   TOGGLE PASSWORD
   ============================================================ */
window.togglePassword = function(id, el){
    var inp = document.getElementById(id);
    if(!inp) return;
    if(inp.type === 'password'){ inp.type = 'text'; el.classList.remove('fa-eye'); el.classList.add('fa-eye-slash'); }
    else { inp.type = 'password'; el.classList.remove('fa-eye-slash'); el.classList.add('fa-eye'); }
};

/* ============================================================
   SWITCH FORM
   ============================================================ */
window.switchForm = function(name){
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById(name + 'Form').classList.add('active');
};

/* ============================================================
   SIGNUP — Firebase + Firestore
   ============================================================ */
window.handleSignup = async function(){
    var name = document.getElementById('signupName').value.trim();
    var email = document.getElementById('signupEmail').value.trim().toLowerCase();
    var pass = document.getElementById('signupPass').value.trim();
    var ref = document.getElementById('signupRef').value.trim();

    if(!name){ showToast('⚠️ Full name likhein!'); return; }
    if(!email || !email.includes('@')){ showToast('⚠️ Sahi email likhein!'); return; }
    if(pass.length < 6){ showToast('⚠️ Password kam az kam 6 characters!'); return; }

    var btn = document.getElementById('signupBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

    try{
        // 1. Firebase Auth mein user banao
        var cred = await createUserWithEmailAndPassword(auth, email, pass);

        // 2. Firestore mein user data save karo
        //    Referral: Agar URL se aaya hai to woh, warna khali
        var referralValue = ref ? ref.trim().toLowerCase() : 'N/A';

        await setDoc(doc(db, 'users', email), {
            name: name,
            email: email,
            referral: referralValue,
            balance: 0,
            blocked: false,
            uid: cred.user.uid,
            createdAt: new Date().toISOString()
        });

        showToast('✅ Account Created! Ab login karein.');
        setTimeout(function(){
            switchForm('login');
            document.getElementById('loginEmail').value = email;
            document.getElementById('signupName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPass').value = '';
            document.getElementById('signupRef').value = '';
        }, 1200);
    }catch(e){
        console.log('Signup error:', e);
        if(e.code === 'auth/email-already-in-use') showToast('⚠️ Yeh email pehle se registered hai!');
        else if(e.code === 'auth/weak-password') showToast('⚠️ Password kamzor hai!');
        else if(e.code === 'auth/invalid-email') showToast('⚠️ Email sahi nahi hai!');
        else if(e.code === 'permission-denied') showToast('❌ Firestore rules check karein!');
        else showToast('❌ ' + (e.message || e.code));
    }finally{
        btn.disabled = false;
        btn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
    }
};/* ============================================================
   LOGIN — Firebase Auth
   ============================================================ */
window.handleLogin = async function(){
    var email = document.getElementById('loginEmail').value.trim().toLowerCase();
    var pass = document.getElementById('loginPass').value.trim();

    if(!email || !pass){ showToast('⚠️ Email aur password dono likhein!'); return; }

    var btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try{
        // 1. Firebase Auth login
        await signInWithEmailAndPassword(auth, email, pass);

        // 2. Firestore se user data le kar aao
        var userSnap = await getDoc(doc(db, 'users', email));
        if(!userSnap.exists()){
            showToast('❌ User data nahi mila!');
            await signOut(auth);
            return;
        }

        var u = userSnap.data();

        // 3. Block check
        if(u.blocked === true){
            showToast('🚫 Aap ka account BLOCKED hai!');
            await signOut(auth);
            return;
        }

        // 4. Session save karo (localStorage)
        localStorage.setItem('kingcobra_current', JSON.stringify({
            name: u.name,
            email: u.email,
            referral: u.referral,
            balance: u.balance || 0
        }));

        showToast('✅ Login Successful!');
        setTimeout(function(){ window.location.href = 'dashboard.html'; }, 700);

    }catch(e){
        console.log('Login error:', e);
        if(e.code === 'auth/user-not-found') showToast('❌ Account nahi mila!');
        else if(e.code === 'auth/wrong-password') showToast('❌ Password ghalat!');
        else if(e.code === 'auth/invalid-credential') showToast('❌ Email ya password ghalat!');
        else if(e.code === 'auth/invalid-email') showToast('⚠️ Email sahi nahi!');
        else showToast('❌ ' + (e.message || e.code));
    }finally{
        btn.disabled = false;
        btn.innerHTML = 'Login Now <i class="fas fa-arrow-right"></i>';
    }
};

/* ============================================================
   URL SE REFERRAL AUTO-FILL + AUTO LOGIN
   ============================================================ */
window.addEventListener('load', function(){
    // ✅ URL se ?ref= nikaalo
    var urlParams = new URLSearchParams(window.location.search);
    var refParam = urlParams.get('ref');

    if(refParam){
        try{
            // URL decode karo (e.g. ali%40gmail.com → ali@gmail.com)
            var decodedRef = decodeURIComponent(refParam);

            // Signup form kholo
            switchForm('signup');

            // Referral input mein auto-fill karo
            var refInput = document.getElementById('signupRef');
            if(refInput){
                refInput.value = decodedRef;
                // Highlight karo
                refInput.style.borderColor = '#00FF00';
                refInput.style.boxShadow = '0 0 15px rgba(0,255,0,0.4)';
            }

            // User ko batao
            setTimeout(function(){
                showToast('👥 Referral applied: ' + decodedRef);
            }, 500);

        }catch(e){ console.log('Ref parse error:', e); }
    }

    // ✅ AUTO LOGIN — Agar pehle se logged in ho
    var cur = localStorage.getItem('kingcobra_current');
    if(cur){
        try{
            var d = JSON.parse(cur);
            if(d.email){ window.location.href = 'dashboard.html'; }
        }catch(e){}
    }
});

console.log("🐍 Script.js Loaded — With Email-Based Referral");