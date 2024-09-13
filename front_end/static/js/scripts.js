/*
  --------------------------------------------------------------------------------------
  Função para formatar o telefone para o formato (XX)XXXXX-XXXX.
  --------------------------------------------------------------------------------------
*/
const formatarTelefone = (numero) => {
  // Supondo que o número tenha 11 dígitos (incluindo o DDD)
  return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
}

/*
  --------------------------------------------------------------------------------------
  Função para formatar a data para o formato dd/mm/yyyy.
  --------------------------------------------------------------------------------------
*/
const formatarData = (data) => {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente  de agendamentos do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/agendamentos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.agendamentos.forEach(reserva => {
        const telefoneFormatado = formatarTelefone(reserva.telefone);
        const dataFormatada = formatarData(reserva.data_agendamento);
        insertList(reserva.nome, telefoneFormatado, reserva.email, reserva.sala, dataFormatada, reserva.hora_agendamento);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um reserva na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postReserva = async (inputReserva, inputTelefone, inputEmail, inputSala, inputData_agendamento, inputHora_agendamento) => {
  const formData = new FormData();
  formData.append('nome', inputReserva);
  formData.append('telefone', inputTelefone);
  formData.append('email', inputEmail);
  formData.append('sala', inputSala);
  formData.append('data_agendamento', inputData_agendamento);
  formData.append('hora_agendamento', inputHora_agendamento);


  let url = 'http://127.0.0.1:5000/agendamento';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada reserva da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let img = document.createElement("img");
  img.src = "static/img/lixeiraazul.png"; // Substitua pelo caminho da sua imagem
  img.alt = "Fechar"; // Texto alternativo para a imagem
  img.style.width = "15px";
  img.style.height = "15px";
  
  // Adiciona eventos para mudar a imagem ao posicionar o mouse
  img.onmouseover = () => {
    img.src = "static/img/lixo.png"; // Substitua pelo caminho da imagem ao passar o mouse
  };
  img.onmouseout = () => {
    img.src = "static/img/lixeiraazul.png"; // Volta para a imagem original ao tirar o mouse
  };

  span.className = "close";
  span.appendChild(img);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um agendamento da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeReserva = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteReserva(nomeReserva)
        alert("Agendamento cancelado!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um agendamento da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteReserva = (reserva) => {
  console.log(reserva)
  let url = 'http://127.0.0.1:5000/agendamento?nome=' + reserva;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo agendamento
  --------------------------------------------------------------------------------------
*/
const novaReserva = () => {
  let inputReserva = document.getElementById("novoProfssional").value;
  let inputTelefone = document.getElementById("novoTelefone").value;
  let inputEmail = document.getElementById("novoEmail").value;
  let inputSala = document.getElementById("novaSala").value;
  let inputData_agendamento = document.getElementById("novaData_agendamento").value;
  let inputHora_agendamento = document.getElementById("novaHora_agendamento").value;

  if (inputReserva === '') {
    alert("Escreva o nome de um reserva!");
  } else if (isNaN(inputTelefone)) {
    alert("O campo telefone deve ser preenchido com números");
  } else {
    insertList(inputReserva, inputTelefone, inputEmail, inputSala, inputData_agendamento, inputHora_agendamento);
    postReserva(inputReserva, inputTelefone, inputEmail, inputSala, inputData_agendamento, inputHora_agendamento)
      .then(() => {
        alert("Agendamento realizado!");
        location.reload(); // Recarrega a página após a inserção bem-sucedida
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir um agendamento na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nomeProfissional, telefoneFormatado, email, sala, data_agendamento, hora_agendamento) => {
  var reserva = [nomeProfissional, telefoneFormatado, email, sala, data_agendamento, hora_agendamento]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < reserva.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = reserva[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("novoProfssional").value = "";
  document.getElementById("novoTelefone").value = "";
  document.getElementById("novoEmail").value = "";
  document.getElementById("novaSala").value = "";
  document.getElementById("novaData_agendamento").value = "";
  document.getElementById("novaHora_agendamento").value = "";

  removeElement()
}


document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submitBtn');
  const inputs = document.querySelectorAll('#novaReserva input, #novaReserva select');

  function checkInputs() {
      let allFilled = true;
      inputs.forEach(input => {
          if (input.value === '') {
              allFilled = false;
          }
      });
      submitBtn.disabled = !allFilled;
  }

  inputs.forEach(input => {
      input.addEventListener('input', checkInputs);
  });

  checkInputs(); // Verifica os campos ao carregar a página
});




/*
  --------------------------------------------------------------------------------------
  Função para inserir um agendamento na lista apresentada
  --------------------------------------------------------------------------------------
*/

document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value;
  fetch(`/agendamentos/nome?nome=${encodeURIComponent(nome)}`)
      .then(response => response.json())
      .then(data => {
          const resultadosDiv = document.getElementById('resultados');
          resultadosDiv.innerHTML = '';
          if (data.agendamentos.length === 0) {
              resultadosDiv.innerHTML = '<p>Nenhum agendamento encontrado para este nome.</p>';
          } else {
              const lista = document.createElement('ul');
              data.agendamentos.forEach(agendamento => {
                  const item = document.createElement('li');
                  item.textContent = `Nome: ${agendamento.nome}, Telefone: ${agendamento.telefone}, Email: ${agendamento.email}, Sala: ${agendamento.sala}, Data: ${agendamento.data_agendamento}, Hora: ${agendamento.hora_agendamento}`;
                  lista.appendChild(item);
              });
              resultadosDiv.appendChild(lista);
          }
      })
      .catch(error => {
          console.error('Erro ao buscar agendamentos:', error);
      });
});




