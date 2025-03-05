import React, { useState } from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import '../App.css';

const Budget = () => {
    const { serviceId } = useParams();
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ nome: '', tipo: 'Peça', valor: '' });
    const [editingItem, setEditingItem] = useState(null);

    const handleSubmitItem = (e) => {
        e.preventDefault();
        if (editingItem) {
            // Atualiza item existente
            const updatedItems = items.map((item) =>
                item.id === editingItem.id ? { ...editingItem, ...formData } : item
            );
            setItems(updatedItems);
            setEditingItem(null);
        } else {
            // Adiciona novo item com um id único (utilizando Date.now())
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

    const handleSaveBudget = async () => {
        if (!serviceId) {
            alert('Informe o ID do serviço.');
            return;
        }
        const payload = {
            service_id: serviceId,
            data: JSON.stringify(items),
        };

        try {
            // Pode ser necessário ajustar para PUT caso já exista orçamento para o serviço
            const response = await axios.post('http://localhost:5000/budget', payload);
            if (response.status === 200 || response.status === 201) {
                alert('Orçamento salvo com sucesso!');
            } else {
                alert('Erro ao salvar orçamento.');
            }
        } catch (error) {
            console.error('Erro ao salvar orçamento:', error);
            alert('Erro ao salvar orçamento.');
        }
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
                    <button type="submit">
                        {editingItem ? 'Atualizar' : 'Adicionar'}
                    </button>
                    {editingItem && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingItem(null);
                                setFormData({ nome: '', tipo: 'Peça', valor: '' });
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                <tr className="section-header">
                    <td colSpan="4">Peças</td>
                </tr>
                {items.filter((item) => item.tipo === 'Peça').map((item) => (
                    <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{item.tipo}</td>
                        <td>{Number(item.valor).toFixed(2)}</td>
                        <td>
                            <button onClick={() => handleEdit(item)}>Editar</button>
                            <button onClick={() => handleDelete(item.id)}>Remover</button>
                        </td>
                    </tr>
                ))}
                <tr className="section-header">
                    <td colSpan="4">Serviços</td>
                </tr>
                {items.filter((item) => item.tipo === 'Serviço').map((item) => (
                    <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{item.tipo}</td>
                        <td>{Number(item.valor).toFixed(2)}</td>
                        <td>
                            <button onClick={() => handleEdit(item)}>Editar</button>
                            <button onClick={() => handleDelete(item.id)}>Remover</button>
                        </td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr>
                        <td colSpan="4">Nenhum item adicionado.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="totals">
                <p>
                    <strong>Subtotal Peças:</strong> R$ {subtotalPecas.toFixed(2)}
                </p>
                <p>
                    <strong>Subtotal Serviços:</strong> R$ {subtotalServicos.toFixed(2)}
                </p>
                <p>
                    <strong>Total Geral:</strong> R$ {totalGeral.toFixed(2)}
                </p>
            </div>

            <div className="button-group">
                <button onClick={handleSaveBudget}>Salvar Orçamento</button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/">
                    <button>Voltar</button>
                </Link>
            </div>
        </div>
    );
};

export default Budget;
