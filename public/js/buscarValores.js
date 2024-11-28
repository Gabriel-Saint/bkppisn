
function buscarValores() {
  try {
    fetch('/buscar-valores')
      .then(response => response.json()
      )
      .then(data => {
        console.log(data);
        document.getElementById('entrada').innerText = data[0].total_entradas;
        document.getElementById('saidas').innerText = data[0].total_saidas;
        document.getElementById('total').innerText = data[0].saldo;

      })
      .catch(error => {
        console.error('Erro ao obter os saldos:', error);
      });
  } catch (error) {
    console.error("Erro ao obter os saldos")
  }


}

buscarValores();