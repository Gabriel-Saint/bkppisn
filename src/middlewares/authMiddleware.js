const express = require('express');

const autenticacaoMiddleware = (req, res, next) => {
  if (!req.session.user) {
    console.log(req.session)
    return res.redirect('/');
  }
  console.log(req.session)

  next();
};

module.exports = autenticacaoMiddleware;

/*
module.exports = (req, res, next) => {
    if (!req.session.usuario) {
     
      return res.redirect('/login');
    }
    
    next();
  };
  */