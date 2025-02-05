from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    os = db.Column(db.String, nullable=True)
    start_time = db.Column(db.Date, nullable=True)
    end_time = db.Column(db.Date, nullable=True)
    customer_name = db.Column(db.String, nullable=True)
    address = db.Column(db.String, nullable=True)
    cpf = db.Column(db.String, nullable=True)
    phone = db.Column(db.String, nullable=True)
    workshop = db.Column(db.String, nullable=True)
    car = db.Column(db.String, nullable=True)
    license_plate = db.Column(db.String, nullable=True)
    motor = db.Column(db.String, nullable=True)
    motor_number = db.Column(db.String, nullable=True)
    km = db.Column(db.String, nullable=True)
    cylinders = db.Column(db.String, nullable=True)
    fixed = db.Column(db.String, nullable=True)
    movable = db.Column(db.String, nullable=True)
    price = db.Column(db.String, nullable=True)
    payment_method = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=True)
    receipt_certificate = db.Column(db.String, nullable=True)
    observations = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "os": self.os,
            "start_time": self.dataEntrada.isoformat() if self.dataEntrada else None,
            "end_time": self.dataSaida.isoformat() if self.dataSaida else None,
            "customer_name": self.nomeCliente,
            "address": self.endereco,
            "cpf": self.cpf,
            "phone": self.telefone,
            "workshop": self.oficina,
            "car": self.veiculo,
            "license_plate": self.placa,
            "motor": self.motor,
            "motor_number": self.numeroMotor,
            "km": self.km,
            "cylinders": self.cilindros,
            "fixed": self.fixos,
            "movable": self.moveis,
            "price": self.valor,
            "payment_method": self.formaPagamento,
            "description": self.descricao,
            "receipt_certificate": self.reciboCertificado,
            "observations": self.observacoes,
        }
