const path = require('path');
const dashboard = path.resolve(__dirname, '../../view/dashboard.ejs');

async function exibirDashboard(req, res) {
    res.render(dashboard);
}

module.exports = {
    exibirDashboard: exibirDashboard
};
