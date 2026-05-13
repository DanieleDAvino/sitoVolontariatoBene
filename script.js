document.addEventListener("DOMContentLoaded", function() {

    // ══════════════════════════════════════════════════════════════════
    // 1. LEGGE LA SESSIONE E PERSONALIZZA LA NAVBAR
    // ══════════════════════════════════════════════════════════════════
    aggiornaNavbar();

    async function aggiornaNavbar() {
        try {
            const risposta = await fetch('sessione.php');
            const sessione = await risposta.json();

            const navRegistrazione = document.getElementById('nav-registrazione');
            const navAccesso       = document.getElementById('nav-accesso');
            const navAreaRiservata = document.getElementById('nav-area-riservata');
            const navAdmin         = document.getElementById('nav-admin');
            const navLogout        = document.getElementById('nav-logout');
            const navNomeUtente    = document.getElementById('nav-nome-utente');

            // Esci se gli elementi non esistono (pagine diverse da index.html)
            if (!navRegistrazione) return;

            if (!sessione.loggato) {
                // ── Visitatore anonimo ────────────────────────────────────────
                navRegistrazione.classList.remove('d-none');
                navAccesso.classList.remove('d-none');
                navAreaRiservata.classList.add('d-none');
                navAdmin.classList.add('d-none');
                navLogout.classList.add('d-none');

            } else if (sessione.ruolo === 'utente') {
                // ── Utente loggato ────────────────────────────────────────────
                navRegistrazione.classList.add('d-none');
                navAccesso.classList.add('d-none');
                navAreaRiservata.classList.remove('d-none');
                navAdmin.classList.add('d-none');
                navLogout.classList.remove('d-none');
                if (navNomeUtente) navNomeUtente.textContent = 'Ciao, ' + sessione.nome + '!';

            } else if (sessione.ruolo === 'admin') {
                // ── Admin loggato ─────────────────────────────────────────────
                navRegistrazione.classList.add('d-none');
                navAccesso.classList.add('d-none');
                navAreaRiservata.classList.add('d-none');
                navAdmin.classList.remove('d-none');
                navLogout.classList.remove('d-none');
            }

        } catch (e) {
            // sessione.php non raggiungibile: navbar rimane com'è
            console.warn('Impossibile leggere la sessione:', e);
        }
    }


    // ══════════════════════════════════════════════════════════════════
    // 2. CARICAMENTO DINAMICO DEI CONTENUTI
    // ══════════════════════════════════════════════════════════════════
    const contentContainer = document.getElementById('content-container');
    if (contentContainer) {
        loadContent('introduzione.html');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // I link .php (admin, area_riservata, logout) navigano normalmente
                if (href && href.endsWith('.php')) return;

                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
                this.classList.add('active');
                loadContent(href);
            });
        });
    }

    if (document.getElementById('login-form'))        initLoginForm();
    if (document.getElementById('registration-form')) initRegistrationForm();


    function loadContent(url) {
        const container = document.getElementById('content-container');
        if (!container) return;

        fetch(url)
            .then(r => r.text())
            .then(data => {
                container.innerHTML = data;

                if (url === 'registrazione.html') initRegistrationForm();
                if (url === 'accesso.html')       initLoginForm();

                // image-card
                document.querySelectorAll('.image-card').forEach(card => {
                    card.addEventListener('click', function(e) {
                        e.preventDefault();
                        const target = this.getAttribute('href');
                        document.querySelectorAll('.nav-link').forEach(nl => {
                            nl.classList.remove('active');
                            if (nl.getAttribute('href') === target) nl.classList.add('active');
                        });
                        loadContent(target);
                    });
                });

                // bottoni con href .html
                document.querySelectorAll('.btn[href]').forEach(btn => {
                    if (btn.type === 'submit' || btn.closest('form')) return;
                    const target = btn.getAttribute('href');
                    if (!target || !target.endsWith('.html')) return;
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        document.querySelectorAll('.nav-link').forEach(nl => {
                            nl.classList.remove('active');
                            if (nl.getAttribute('href') === target) nl.classList.add('active');
                        });
                        loadContent(target);
                    });
                });
            })
            .catch(err => console.error('Errore caricamento:', err));
    }


    // ══════════════════════════════════════════════════════════════════
    // 3. FORM REGISTRAZIONE
    // ══════════════════════════════════════════════════════════════════
    function initRegistrationForm() {
        const form = document.getElementById('registration-form');
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            const nome          = document.getElementById('nome').value;
            const cognome       = document.getElementById('cognome').value;
            const email         = document.getElementById('email').value;
            const psswd         = document.getElementById('psswd').value;
            const telefono      = document.getElementById('telefono').value;
            const eta           = document.getElementById('eta').value;
            const area          = document.getElementById('area').value;
            const disponibilita = document.getElementById('disponibilita').value;
            const esperienze    = document.getElementById('esperienze').value;
            const motivazione   = document.getElementById('motivazione').value;

            let allertString = "";
            if (!/^([A-Z]){1}([A-z]||\W)+/.test(nome))          allertString += "- Nome non valido, deve iniziare con una lettera maiuscola\n";
            if (!/^([A-Z]){1}([A-z]||\W)+/.test(cognome))        allertString += "- Cognome non valido, deve iniziare con una lettera maiuscola\n";
            if (!/^\w+\.?\w+?\@{1}[A-z]{1,}\.{1}[A-z]{2,}$/.test(email)) allertString += "- Email non valida, formato richiesto: esempio@email.com\n";
            if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(psswd)) allertString += "- Password non valida: minimo 8 caratteri, almeno una maiuscola, una minuscola, un numero e un carattere speciale\n";
            if (!/^(\+39\s?)?3\d{2}[\s\-]?\d{3}[\s\-]?\d{4}$/.test(telefono)) allertString += "- Telefono non valido, formato: +39 123 456 7890\n";
            if (!/\d{2,3}/.test(eta) || eta < 18)                allertString += "- Età non valida, devi essere maggiorenne\n";
            if (allertString !== "") { alert(allertString); return; }

            const btnSubmit         = document.getElementById('btn-submit');
            const messaggioRisposta = document.getElementById('messaggio-risposta');
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Invio in corso...';
            messaggioRisposta.style.display = 'none';

            const datiForm = new FormData();
            ['nome','cognome','email','psswd','telefono','eta','area','disponibilita','esperienze','motivazione'].forEach(k => {
                datiForm.append(k, eval(k));
            });

            try {
                const risposta  = await fetch('registrazione.php', { method: 'POST', body: datiForm });
                const risultato = await risposta.json();
                messaggioRisposta.style.display = 'block';

                if (risultato.successo) {
                    messaggioRisposta.className = 'alert alert-success mt-3';
                    messaggioRisposta.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + risultato.messaggio;
                    form.reset();

                    const datiJson = { nome, cognome, email, telefono, eta, area, disponibilita, esperienze, motivazione };
                    const blob = new Blob([JSON.stringify(datiJson, null, 2)], { type: 'application/json' });
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl; a.download = `iscrizione_${nome}_${cognome}.json`; a.click();
                    URL.revokeObjectURL(blobUrl);
                } else {
                    messaggioRisposta.className = 'alert alert-danger mt-3';
                    let msg = '<i class="fas fa-exclamation-circle me-2"></i>' + risultato.messaggio;
                    if (risultato.debug) msg += '<br><small>Debug: ' + risultato.debug + '</small>';
                    messaggioRisposta.innerHTML = msg;
                }
            } catch (err) {
                messaggioRisposta.style.display = 'block';
                messaggioRisposta.className = 'alert alert-danger mt-3';
                messaggioRisposta.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Errore di connessione. Riprova più tardi.';
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Invia Richiesta';
            }
        });
    }


    // ══════════════════════════════════════════════════════════════════
    // 4. FORM LOGIN
    // ══════════════════════════════════════════════════════════════════
    function initLoginForm() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email             = document.getElementById('email').value;
            const psswd             = document.getElementById('psswd').value;
            const btnLogin          = document.getElementById('btn-login');
            const messaggioRisposta = document.getElementById('messaggio-risposta');

            let allertString = "";
            if (!/^\w+\.?\w+?\@{1}[A-z]{1,}\.{1}[A-z]{2,}$/.test(email)) allertString += "- Email non valida\n";
            if (psswd.length < 8) allertString += "- Password troppo corta\n";
            if (allertString !== "") { alert(allertString); return; }

            btnLogin.disabled = true;
            btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Accesso in corso...';
            messaggioRisposta.style.display = 'none';

            const datiForm = new FormData();
            datiForm.append('email', email);
            datiForm.append('psswd', psswd);

            try {
                const risposta  = await fetch('accesso.php', { method: 'POST', body: datiForm });
                const risultato = await risposta.json();
                messaggioRisposta.style.display = 'block';

                if (risultato.successo) {
                    messaggioRisposta.className = 'alert alert-success mt-3';

                    if (risultato.ruolo === 'admin') {
                        messaggioRisposta.innerHTML = '<i class="fas fa-user-shield me-2"></i>Accesso admin! Reindirizzamento...';
                        setTimeout(() => { window.location.href = 'admin.php'; }, 1000);
                    } else {
                        messaggioRisposta.innerHTML = '<i class="fas fa-check-circle me-2"></i>Bentornato/a ' + risultato.nome + '! Reindirizzamento...';
                        setTimeout(() => { window.location.href = 'area_riservata.php'; }, 1500);
                    }
                } else {
                    messaggioRisposta.className = 'alert alert-danger mt-3';
                    messaggioRisposta.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + risultato.messaggio;
                }

            } catch (err) {
                messaggioRisposta.style.display = 'block';
                messaggioRisposta.className = 'alert alert-danger mt-3';
                messaggioRisposta.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Errore di connessione. Riprova più tardi.';
            } finally {
                btnLogin.disabled = false;
                btnLogin.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Accedi';
            }
        });
    }

});