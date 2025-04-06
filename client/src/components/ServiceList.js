import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [filters, setFilters] = useState({
        customer_name: '',
        workshop: '',
        car: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchServices = useCallback(async () => {
        const params = {};
        Object.keys(filters).forEach((key) => {
            if (filters[key]) params[key] = filters[key];
        });
        try {
            const response = await axios.get('http://localhost:5000/services', { params });
            setServices(response.data);
            setCurrentPage(1); // reinicia para a primeira página ao aplicar filtros
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(services.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="container">
            <h2>Lista de Serviços</h2>
            <form onSubmit={handleFilterSubmit}>
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
                    <label>Oficina:</label>
                    <input
                        type="text"
                        name="workshop"
                        placeholder="Digite o nome da oficina"
                        value={filters.workshop}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="form-group">
                    <label>Carro:</label>
                    <input
                        type="text"
                        name="car"
                        placeholder="Digite o modelo do carro"
                        value={filters.car}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="button-group">
                    <button type="submit" title="Filtrar">
                        <FontAwesomeIcon icon="search"/> Filtrar
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
                {currentServices.map((service) => (
                    <tr key={service.id}>
                        <td>{service.os}</td>
                        <td>{service.start_time ? new Date(service.start_time).toLocaleDateString('pt-BR') : ''}</td>
                        <td>{service.end_time ? new Date(service.end_time).toLocaleDateString('pt-BR') : ''}</td>
                        <td>{service.customer_name}</td>
                        <td>{service.license_plate}</td>
                        <td>
                            <Link to={`/edit/${service.id}`}>
                                <button title="Editar">
                                    <FontAwesomeIcon icon="edit" />
                                </button>
                            </Link>
                            <Link to={`/budget/${service.id}`}>
                                <button title="Criar/Editar Orçamento" style={{ marginLeft: '5px' }}>
                                    <FontAwesomeIcon icon="file-invoice-dollar" />
                                </button>
                            </Link>
                            <Link to={`/service/${service.id}/docs`}>
                                <button title="Documentos" style={{ marginLeft: '5px' }}>
                                    <FontAwesomeIcon icon="file-alt" />
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

            {/* Controles de Paginação */}
            <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
                <div className="button-group" style={{ justifyContent: 'center', gap: '5px' }}>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value="10">10 registros</option>
                        <option value="25">25 registros</option>
                        <option value="50">50 registros</option>
                    </select>
                    <button
                        className="pagination-btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Página anterior"
                    >
                        <FontAwesomeIcon icon="arrow-left" />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                            title={`Página ${index + 1}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="pagination-btn"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        title="Próxima página"
                    >
                        <FontAwesomeIcon icon="arrow-right" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceList;
