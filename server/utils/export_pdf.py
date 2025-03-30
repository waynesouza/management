import json
import os
import requests
from io import BytesIO
from flask import render_template_string, make_response, send_file
from models import Budget, Service


def export_budget_pdf(service_id):
    budget = Budget.query.filter_by(service_id=service_id).first()
    service = Service.query.get(service_id)
    if not budget:
        return None, "Budget not found"

    try:
        items = json.loads(budget.data)
    except Exception as e:
        return None, f"Error processing budget data: {str(e)}"

    parts = [item for item in items if item.get("tipo") == "Peça"]
    services = [item for item in items if item.get("tipo") == "Serviço"]
    subtotal_parts = sum(float(item.get("valor", 0)) for item in parts)
    subtotal_services = sum(float(item.get("valor", 0)) for item in services)
    total = subtotal_parts + subtotal_services

    subtotal_parts_str = f"R$ {subtotal_parts:.2f}".replace(".", ",")
    subtotal_services_str = f"R$ {subtotal_services:.2f}".replace(".", ",")
    total_str = f"R$ {total:.2f}".replace(".", ",")

    observations = budget.observations

    template_name = "budget"
    data = {
        "serviceId": service_id,
        "customerName": service.customer_name,
        "workshop": service.workshop,
        "car": service.car,
        "licensePlate": service.license_plate,
        "parts": parts,
        "services": services,
        "subTotalParts": subtotal_parts_str,
        "subTotalServices": subtotal_services_str,
        "total": total_str,
        "observations": observations
    }
    filename = f"budget_{service_id}"

    base_url = os.environ.get("PDF_GENERATOR_URI")
    java_service_url = f"{base_url}/api/pdf/generate"

    payload = {
        "templateName": template_name,
        "data": data,
        "filename": filename
    }

    try:
        response = requests.post(java_service_url, json=payload)
        if response.status_code != 200:
            return None, f"Error generating PDF in pdf-generator: {response.text}"

        pdf = BytesIO(response.content)
        return send_file(pdf, download_name=f"{filename}.pdf", as_attachment=True, mimetype="application/pdf"), None
    except Exception as e:
        return None, f"Error generating PDF: {str(e)}"


def export_certificate_pdf(service_id, payload):
    service = Service.query.get(service_id)

    template_name = "certificate_guarantee"
    data = {
        "serviceId": service_id,
        "customerName": service.customer_name,
        "car": service.car,
        "licensePlate": service.license_plate,
        "km": service.km,
        "description": payload.get("certificate_description")
    }
    filename = f"certificate_{service_id}"

    base_url = os.environ.get("PDF_GENERATOR_URI")
    java_service_url = f"{base_url}/api/pdf/generate"

    payload = {
        "templateName": template_name,
        "data": data,
        "filename": filename
    }

    try:
        response = requests.post(java_service_url, json=payload)
        if response.status_code != 200:
            return None, f"Error generating PDF in pdf-generator: {response.text}"

        pdf = BytesIO(response.content)
        return send_file(pdf, download_name=f"{filename}.pdf", as_attachment=True, mimetype="application/pdf"), None
    except Exception as e:
        return None, f"Error generating PDF: {str(e)}"


def export_receipt_pdf(service_id, payload):
    service = Service.query.get(service_id)
    price_str = service.price.replace(",", ".")

    template_name = "receipt"
    data = {
        "serviceId": service_id,
        "customerName": service.customer_name,
        "cpf": service.cpf,
        "car": service.car,
        "licensePlate": service.license_plate,
        "price": f"R$ {float(price_str):.2f}".replace(".", ","),
        "description": payload.get("receipt_description")
    }
    filename = f"certificate_{service_id}"

    base_url = os.environ.get("PDF_GENERATOR_URI")
    java_service_url = f"{base_url}/api/pdf/generate"

    payload = {
        "templateName": template_name,
        "data": data,
        "filename": filename
    }

    try:
        response = requests.post(java_service_url, json=payload)
        if response.status_code != 200:
            return None, f"Error generating PDF in pdf-generator: {response.text}"

        pdf = BytesIO(response.content)
        return send_file(pdf, download_name=f"{filename}.pdf", as_attachment=True, mimetype="application/pdf"), None
    except Exception as e:
        return None, f"Error generating PDF: {str(e)}"