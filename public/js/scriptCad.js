
const form = document.getElementById('form');

form.addEventListener('input', (e) => {

    const senha1 = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem');
    const mensagem2 = document.getElementById('mensagem2');
    const senha2 = document.getElementById('senha2').value;

    if (senha1 === '' || senha2 === '') {
        mensagem.textContent = ""

    } else if (senha1 === senha2) {
        mensagem.textContent = ""
    } else {
        mensagem.textContent = "As senhas não coincidem.";
        mensagem.style.color = "red";
    }

    function verificarSenha() {
        let forca = 0;
        const temMaiuscula = /[A-Z]/.test(senha1);
        const temMinuscula = /[a-z]/.test(senha1)
        const temNumero = /[0-9]/.test(senha1);
        const temCaractEspecial = /[^A-Za-z0-9]/.test(senha1);

        if (senha1.length >= 8) forca++;
        if (temMaiuscula) forca++;
        if (temMinuscula) forca++;
        if (temNumero) forca++;
        if (temCaractEspecial) forca++;

        if (forca) {
            if (forca === 5) {
                mensagem2.textContent = "Senha muito forte!";
                mensagem2.style.color = "green";
            }
            else if (forca >= 3) {
                mensagem2.textContent = "Senha razoavel!";
                mensagem2.style.color = "orange";
            } else {
                mensagem2.textContent = "Senha muito fraca!";
                mensagem2.style.color = "red";
            }
        }

    }
    verificarSenha();

})