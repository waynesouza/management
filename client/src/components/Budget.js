import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css';

const Budget = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ nome: '', tipo: 'Peça', valor: '' });
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        if (serviceId) {
            axios
                .get(`http://localhost:5000/budget/${serviceId}`)
                .then((response) => {
                    if (response.data && response.data.data) {
                        try {
                            const loadedItems = JSON.parse(response.data.data);
                            setItems(loadedItems);
                        } catch (error) {
                            console.error('Error processing budget JSON:', error);
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching budget:', error);
                });
        }
    }, [serviceId]);

    const handleSubmitItem = (e) => {
        e.preventDefault();
        if (editingItem) {
            const updatedItems = items.map((item) =>
                item.id === editingItem.id ? { ...editingItem, ...formData } : item
            );
            setItems(updatedItems);
            setEditingItem(null);
        } else {
            const newItem = { id: Date.now(), ...formData };
            setItems([...items, newItem]);
        }
        setFormData({ nome: '', tipo: 'Peça', valor: '' });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ nome: item.nome, tipo: item.tipo, valor: item.valor });
    };

    const handleDelete = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const subtotalPecas = items
        .filter((item) => item.tipo === 'Peça')
        .reduce((acc, item) => acc + Number(item.valor), 0);
    const subtotalServicos = items
        .filter((item) => item.tipo === 'Serviço')
        .reduce((acc, item) => acc + Number(item.valor), 0);
    const totalGeral = subtotalPecas + subtotalServicos;

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);

    const handleSaveBudget = async () => {
        if (!serviceId) {
            alert('ID do serviço não informado.');
            return;
        }
        const payload = {
            service_id: serviceId,
            data: JSON.stringify(items)
        };

        try {
            const response = await axios.post('http://localhost:5000/budget', payload);
            if (response.status === 200 || response.status === 201) {
                alert('Orçamento salvo com sucesso!');
            } else {
                alert('Erro ao salvar orçamento.');
            }
        } catch (error) {
            console.error('Error saving budget:', error);
            alert('Erro ao salvar orçamento.');
        }
    };

    const handleExportPDF = async () => {
        const response = await axios.get(`http://localhost:5000/budget/export/${serviceId}`,
            { responseType: 'blob' });

        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        window.open(fileURL, '_blank');
    };

    return (
        <div className="container">
            <h2>Orçamento - Serviço {serviceId}</h2>
            <form onSubmit={handleSubmitItem}>
                <div className="form-group">
                    <label>Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Nome do item"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tipo:</label>
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                        <option value="Peça">Peça</option>
                        <option value="Serviço">Serviço</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Valor:</label>
                    <input
                        type="number"
                        step="0.01"
                        name="valor"
                        value={formData.valor}
                        onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                        placeholder="Valor"
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="submit" title={editingItem ? 'Editar item' : 'Adicionar item'}>
                        <FontAwesomeIcon icon="edit" /> {editingItem ? 'Editar item' : 'Adicionar item'}
                    </button>
                    {editingItem && (
                        <button
                            type="button"
                            title="Cancelar edição"
                            onClick={() => {
                                setEditingItem(null);
                                setFormData({ nome: '', tipo: 'Peça', valor: '' });
                            }}
                        >
                            <FontAwesomeIcon icon="times" /> Cancelar
                        </button>
                    )}
                </div>
            </form>

            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {/* Section for Peças */}
                <tr className="section-header">
                    <td colSpan="3">Peças</td>
                </tr>
                {items
                    .filter((item) => item.tipo === 'Peça')
                    .map((item) => (
                        <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>{formatCurrency(Number(item.valor))}</td>
                            <td>
                                <button onClick={() => handleEdit(item)} title="Editar" style={{ marginRight: '5px' }}>
                                    <FontAwesomeIcon icon="edit" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} title="Remover">
                                    <FontAwesomeIcon icon="trash-alt" />
                                </button>
                            </td>
                        </tr>
                    ))}
                {items.filter((item) => item.tipo === 'Peça').length > 0 && (
                    <tr className="section-header">
                        <td style={{ textAlign: 'left' }}><strong>Subtotal:</strong></td>
                        <td>{formatCurrency(subtotalPecas)}</td>
                        <td></td>
                    </tr>
                )}
                {/* Spacer between sections */}
                <tr>
                    <td colSpan="3" style={{ border: 'none', height: '15px' }}></td>
                </tr>
                {/* Section for Serviços */}
                <tr className="section-header">
                    <td colSpan="3">Serviços</td>
                </tr>
                {items
                    .filter((item) => item.tipo === 'Serviço')
                    .map((item) => (
                        <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>{formatCurrency(Number(item.valor))}</td>
                            <td>
                                <button onClick={() => handleEdit(item)} title="Editar" style={{ marginRight: '5px' }}>
                                    <FontAwesomeIcon icon="edit" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} title="Remover">
                                    <FontAwesomeIcon icon="trash-alt" />
                                </button>
                            </td>
                        </tr>
                    ))}
                {items.filter((item) => item.tipo === 'Serviço').length > 0 && (
                    <tr className="section-header">
                        <td style={{ textAlign: 'left' }}><strong>Subtotal:</strong></td>
                        <td>{formatCurrency(subtotalServicos)}</td>
                        <td></td>
                    </tr>
                )}
                {items.length === 0 && (
                    <tr>
                        <td colSpan="3">Nenhum item adicionado.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="totals" style={{ textAlign: 'left', marginTop: '20px' }}>
                <p><strong>Total:</strong> {formatCurrency(totalGeral)}</p>
            </div>

            <div className="button-group" style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={handleSaveBudget} title="Salvar Orçamento">
                    <FontAwesomeIcon icon="save" /> Salvar
                </button>
                <button onClick={() => navigate(-1)} title="Voltar" style={{ marginLeft: '10px' }}>
                    <FontAwesomeIcon icon="arrow-left" /> Voltar
                </button>
                <button onClick={handleExportPDF} title="Imprimir" style={{ marginLeft: '10px' }}>
                    <FontAwesomeIcon icon="print" /> Imprimir
                </button>
            </div>
        </div>
    );
};

export default Budget;
