import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css';

const CertificateAndReceipt = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [certificateText, setCertificateText] = useState('');
    const [receiptText, setReceiptText] = useState('');

    useEffect(() => {
        if (serviceId) {
            axios
                .get(`http://localhost:5000/service/${serviceId}`)
                .then((response) => {
                    if (response.data) {
                        setCertificateText(response.data.certificate_description);
                        setReceiptText(response.data.receipt_description);
                    }
                })
                .catch((error) => console.error('Error fetching service:', error));
        }
    }, [serviceId]);

    const handleExportPDF = async (type) => {
        const payload = {
            certificate_description: certificateText,
            receipt_description: receiptText,
        };

        const response = await axios.post(`http://localhost:5000/services/export/${serviceId}/${type}`, payload,
            { responseType: 'blob' });

        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        window.open(fileURL, '_blank');
    };

    return (
        <div className="container">
            <h2>Certificado de Garantia</h2>
            <div className="form-group">
                <textarea
                    name="certificate"
                    value={certificateText}
                    onChange={(e) => setCertificateText(e.target.value)}
                    placeholder="Digite o texto do certificado de garantia"
                    rows="5"
                    style={{ width: '100%' }}
                />
            </div>
            <div className="button-group" style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => handleExportPDF('certificate')} title="Imprimir Certificado" style={{ marginLeft: '10px' }}>
                    <FontAwesomeIcon icon="print" /> Imprimir
                </button>
            </div>

            <h2>Recibo de Pagamento</h2>
            <div className="form-group">
                <textarea
                    name="receipt"
                    value={receiptText}
                    onChange={(e) => setReceiptText(e.target.value)}
                    placeholder="Digite o texto do recibo de pagamento"
                    rows="5"
                    style={{ width: '100%' }}
                />
            </div>
            <div className="button-group" style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => handleExportPDF('receipt')} title="Imprimir Recibo" style={{ marginLeft: '10px' }}>
                    <FontAwesomeIcon icon="print" /> Imprimir
                </button>
            </div>

            <div className="button-group" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button onClick={() => navigate(-1)} title="Voltar">
                    <FontAwesomeIcon icon="arrow-left" /> Voltar
                </button>
            </div>
        </div>
    );
};

export default CertificateAndReceipt;