new DataTable('#example', {

    ajax: {
        url: '/buscar-dados',
        dataSrc: ''
    },
    language: {
        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
    },
    columns: [
        { data: 'record_id' },
        { data: 'description_record' },
        { data: 'name_category' },
        {
            data: 'type_record',
            render: function (data, type, row) {
                if (type === 'display') {
                    return data === 1 ? "Entrada" : "Saída";
                }
                return data;
            }
        },
        {
            data: 'value_record',
            render: function (data, type, row) {
                if (type === 'display') {
                    return `R$: ${data}`;
                }
                return data;
            }
        },
        {
            data: 'date_record',
            render: function (data, type, row) {
                if (type === 'display') {

                    const dataFormatada = new Date(data).toLocaleDateString('pt-BR');

                    return dataFormatada;
                }
                return data;
            }
        },
        {
            data: 'record_id',
            render: function (data, type, row) {
                if (type === 'display') {

                    if ($('#example th:contains("Editar")').length) {

                        return `  <form action="editar" method="get" id="formBtn">
                            <input type="hidden" value="${data}" name="id">
                            <button type="submit" class="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"></path>
                                </svg>
                            </button>
                        </form> `;
                    } else {

                        return '';
                    }
                }
                return data;
            }
        },
        {
            data: 'record_id',
            render: function (data, type, row) {
                if (type === 'display') {
                    if ($('#example th:contains("Apagar")').length) {
                        return `  <form action="deletar-registro" method="post" id="formBtnApg_${data}">
                            <input type="hidden" value="${data}" name="id">
                            <button type="button" class="btn btn-danger" onclick="confirmDelete(${data})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-x" viewBox="0 0 16 16">
                                    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181L15.546 8H14.54l.265-2.91A1 1 0 0 0 13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91H9v1H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zm6.339-1.577A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"></path>
                                    <path d="M11.854 10.146a.5.5 0 0 0-.707.708L12.293 12l-1.146 1.146a.5.5 0 0 0 .707.708L13 12.707l1.146 1.147a.5.5 0 0 0 .708-.708L13.707 12l1.147-1.146a.5.5 0 0 0-.707-.708L13 11.293z"></path>
                                </svg>
                            </button>
                        </form> `;
                    } else {
                        return '';
                    }
                }
                return data;
            }
        }

    ],
    order: [[0, 'desc']],
    dom: 'tip',

});