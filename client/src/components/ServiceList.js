import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [filters, setFilters] = useState({
        os: '',
        customer_name: '',
        license_plate: ''
    });

    const fetchServices = useCallback(async () => {
        const params = {};
        Object.keys(filters).forEach((key) => {
            if (filters[key]) params[key] = filters[key];
        });
        try {
            const response = await axios.get('http://localhost:5000/services', { params });
            setServices(response.data);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    }, [filters]);

    useEffect(() => {
        fetchServices().then();
    }, [fetchServices]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchServices().then();
    };

    return (
        <div className="container">
            <h2>Lista de Serviços</h2>
            <form onSubmit={handleFilterSubmit}>
                <div className="form-group">
                    <label>OS:</label>
                    <input
                        type="text"
                        name="os"
                        placeholder="Digite a OS"
                        value={filters.os}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="form-group">
                    <label>Nome do Cliente:</label>
                    <input
                        type="text"
                        name="customer_name"
                        placeholder="Digite o nome do cliente"
                        value={filters.customer_name}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="form-group">
                    <label>Placa:</label>
                    <input
                        type="text"
                        name="license_plate"
                        placeholder="Digite a placa"
                        value={filters.license_plate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="button-group">
                    <button type="submit" title="Filtrar">
                        <FontAwesomeIcon icon="search" /> Filtrar
                    </button>
                </div>
            </form>

            <div className="button-group" style={{marginTop: '20px', textAlign: 'center'}}>
                <Link to="/create">
                    <button title="Criar Novo Serviço">
                        <FontAwesomeIcon icon="plus"/> Criar Novo Serviço
                    </button>
                </Link>
            </div>

            <table>
                <thead>
                <tr>
                    <th>OS</th>
                    <th>Data de Início</th>
                    <th>Data de Saída</th>
                    <th>Cliente</th>
                    <th>Placa</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {services.map((service) => (
                    <tr key={service.id}>
                        <td>{service.os}</td>
                        <td>{service.start_time ? new Date(service.start_time).toLocaleDateString('pt-BR') : ''}</td>
                        <td>{service.end_time ? new Date(service.end_time).toLocaleDateString('pt-BR') : ''}</td>
                        <td>{service.customer_name}</td>
                        <td>{service.license_plate}</td>
                        <td>
                            <Link to={`/edit/${service.id}`}>
                                <button title="Editar" style={{ marginRight: '5px' }}>
                                    <FontAwesomeIcon icon="edit" />
                                </button>
                            </Link>
                            <Link to={`/budget/${service.id}`}>
                                <button title="Criar/Editar Orçamento">
                                    <FontAwesomeIcon icon="file-invoice-dollar" />
                                </button>
                            </Link>
                        </td>
                    </tr>
                ))}
                {services.length === 0 && (
                    <tr>
                        <td colSpan="6">Nenhum serviço encontrado.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceList;
