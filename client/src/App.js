import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import './App.css';
import Budget from "./components/Budget";

const App = () => {
  return (
      <Router>
        <div className="container">
          <h1>Gestão de Serviços - Retífica de Motores</h1>
          <Routes>
            <Route path="/" element={<ServiceList />} />
            <Route path="/create" element={<ServiceForm />} />
            <Route path="/edit/:id" element={<ServiceForm />} />
            <Route path={"/budget/:serviceId"} element={<Budget />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
