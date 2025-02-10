import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';

const ServiceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState({
        os: '',
        start_time: '',
        end_time: '',
        customer_name: '',
        address: '',
        cpf: '',
        phone: '',
        workshop: '',
        car: '',
        license_plate: '',
        motor: '',
        motor_number: '',
        km: '',
        cylinders: '',
        fixed: '',
        movable: '',
        price: '',
        payment_method: '',
        description: '',
        receipt_certificate: '',
        observations: ''
    });

    useEffect(() => {
        if (id) {
            axios
                .get('http://localhost:5000/services', { params: { id } })
                .then((response) => {
                    if (response.data.length > 0) {
                        const serv = response.data[0];
                        if (serv.start_time) serv.start_time = serv.start_time.split('T')[0];
                        if (serv.end_time) serv.end_time = serv.end_time.split('T')[0];
                        setService(serv);
                    }
                })
                .catch((error) => console.error('Erro ao buscar serviço:', error));
        }
    }, [id]);

    const handleChange = (e) => {
        setService({ ...service, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const preparedService = Object.keys(service).reduce((acc, key) => {
            acc[key] = service[key] === '' ? null : service[key];
            return acc;
        }, {});

        try {
            if (id) {
                await axios.put(`http://localhost:5000/services/${id}`, preparedService);
            } else {
                await axios.post('http://localhost:5000/services', preparedService);
            }
            navigate('/');
        } catch (error) {
            console.error('Erro ao salvar o serviço:', error);
        }
    };

    return (
        <div className="container">
            <h2>{id ? 'Editar Serviço' : 'Criar Serviço'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>OS:</label>
                    <input type="text" name="os" value={service.os} onChange={handleChange} placeholder="Digite a OS" />
                </div>
                <div className="form-group">
                    <label>Data da Entrada:</label>
                    <input type="date" name="start_time" value={service.start_time} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Data da Saída:</label>
                    <input type="date" name="end_time" value={service.end_time} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Nome do Cliente:</label>
                    <input type="text" name="customer_name" value={service.customer_name} onChange={handleChange} placeholder="Digite o nome do cliente" />
                </div>
                <div className="form-group">
                    <label>Endereço:</label>
                    <input type="text" name="address" value={service.address} onChange={handleChange} placeholder="Digite o endereço" />
                </div>
                <div className="form-group">
                    <label>CPF:</label>
                    <input type="text" name="cpf" value={service.cpf} onChange={handleChange} placeholder="Digite o CPF" />
                </div>
                <div className="form-group">
                    <label>Telefone:</label>
                    <input type="text" name="phone" value={service.phone} onChange={handleChange} placeholder="Digite o telefone" />
                </div>
                <div className="form-group">
                    <label>Oficina:</label>
                    <input type="text" name="workshop" value={service.workshop} onChange={handleChange} placeholder="Digite o nome da oficina" />
                </div>
                <div className="form-group">
                    <label>Carro:</label>
                    <input type="text" name="car" value={service.car} onChange={handleChange} placeholder="Digite o modelo do carro" />
                </div>
                <div className="form-group">
                    <label>Placa:</label>
                    <input type="text" name="license_plate" value={service.license_plate} onChange={handleChange} placeholder="Digite a placa" />
                </div>
                <div className="form-group">
                    <label>Motor:</label>
                    <input type="text" name="motor" value={service.motor} onChange={handleChange} placeholder="Digite o motor" />
                </div>
                <div className="form-group">
                    <label>Número do Motor:</label>
                    <input type="text" name="motor_number" value={service.motor_number} onChange={handleChange} placeholder="Digite o número do motor" />
                </div>
                <div className="form-group">
                    <label>KM:</label>
                    <input type="text" name="km" value={service.km} onChange={handleChange} placeholder="Digite a quilometragem" />
                </div>
                <div className="form-group">
                    <label>Cilindros:</label>
                    <input type="text" name="cylinders" value={service.cylinders} onChange={handleChange} placeholder="Digite o número de cilindros" />
                </div>
                <div className="form-group">
                    <label>Fixos:</label>
                    <input type="text" name="fixed" value={service.fixed} onChange={handleChange} placeholder="Digite os fixos" />
                </div>
                <div className="form-group">
                    <label>Móveis:</label>
                    <input type="text" name="movable" value={service.movable} onChange={handleChange} placeholder="Digite os móveis" />
                </div>
                <div className="form-group">
                    <label>Preço:</label>
                    <input type="text" name="price" value={service.price} onChange={handleChange} placeholder="Digite o preço" />
                </div>
                <div className="form-group">
                    <label>Forma de Pagamento:</label>
                    <input type="text" name="payment_method" value={service.payment_method} onChange={handleChange} placeholder="Digite a forma de pagamento" />
                </div>
                <div className="form-group">
                    <label>Descrição:</label>
                    <textarea name="description" value={service.description} onChange={handleChange} placeholder="Digite a descrição"></textarea>
                </div>
                <div className="form-group">
                    <label>Recibo/Certificado:</label>
                    <input type="text" name="receipt_certificate" value={service.receipt_certificate} onChange={handleChange} placeholder="Digite o recibo ou certificado" />
                </div>
                <div className="form-group">
                    <label>Observações:</label>
                    <textarea name="observations" value={service.observations} onChange={handleChange} placeholder="Digite as observações"></textarea>
                </div>
                <div className="button-group">
                    <button type="submit">{id ? 'Atualizar' : 'Criar'}</button>
                    <Link to="/">
                        <button type="button" className="secondary">Cancelar</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;
