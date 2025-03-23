import base64
import json
from io import BytesIO
from weasyprint import HTML
from flask import render_template_string, make_response
from models import Budget


def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return f"data:image/png;base64,{encoded_string}"


def export_budget_pdf(service_id):
    budget = Budget.query.filter_by(service_id=service_id).first()
    if not budget:
        return None, "Budget not found"

    try:
        items = json.loads(budget.data)
    except Exception as e:
        return None, f"Error processing budget data: {str(e)}"

    logo_base64 = image_to_base64("/app/images/logo.png")

    parts = [item for item in items if item.get("tipo") == "Peça"]
    services = [item for item in items if item.get("tipo") == "Serviço"]
    subtotal_parts = sum(float(item.get("valor", 0)) for item in parts)
    subtotal_services = sum(float(item.get("valor", 0)) for item in services)
    total = subtotal_parts + subtotal_services

    subtotal_parts_str = f"R$ {subtotal_parts:.2f}".replace(".", ",")
    subtotal_services_str = f"R$ {subtotal_services:.2f}".replace(".", ",")
    total_str = f"R$ {total:.2f}".replace(".", ",")

    html = render_template_string('''
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Orçamento - Serviço {{ service_id }}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body { 
          font-family: Arial, sans-serif; 
          font-size: 16px; 
          line-height: 1.4;
        }
        h2 { 
          text-align: center; 
          margin-top: 20px;
          margin-bottom: 20px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px; 
          margin-bottom: 20px;
        }
        th, td { 
          border: 1px solid #333; 
          padding: 8px; 
          text-align: left; 
          vertical-align: middle; 
        }
        th { 
          background-color: #f2f2f2; 
        }
        .header-table { 
          width: 100%;
          margin-bottom: 30px;
        }
        .header-table td {
          border: none;
        }
        .logo { 
          width: 150px; 
          height: auto; 
        }
        .company-info { 
          text-align: left; 
        }
        .company-info p { 
          margin: 0; 
          line-height: 1.2; 
        }
        .section-header { 
          background-color: #e9ecef; 
          font-weight: bold; 
        }
        .spacer { 
          height: 15px; 
        }
        .spacer td {
          border: none;
        }
        .total {
          text-align: right;
          margin-top: 20px;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width:30%; text-align:center;">
            {% if logo_base64 %}
            <img src="{{ logo_base64 }}" alt="Company Logo" class="logo">
            {% endif %}
          </td>
          <td style="width:70%;" class="company-info">
            <!-- Informações da empresa podem ser adicionadas aqui -->
          </td>
        </tr>
      </table>

      <h2>Orçamento - Serviço {{ service_id }}</h2>

      {% if parts|length > 0 %}
      <table>
        <thead>
          <tr>
            <th colspan="2" class="section-header">Peças</th>
          </tr>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {% for item in parts %}
          <tr>
            <td>{{ item.nome }}</td>
            <td>R$ {{ "%.2f"|format(item.valor|float).replace(".", ",") }}</td>
          </tr>
          {% endfor %}
          <tr>
            <td style="text-align: right;"><strong>Subtotal Peças:</strong></td>
            <td><strong>{{ subtotal_parts_str }}</strong></td>
          </tr>
        </tbody>
      </table>
      {% endif %}

      {% if services|length > 0 %}
      <table>
        <thead>
          <tr>
            <th colspan="2" class="section-header">Serviços</th>
          </tr>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {% for item in services %}
          <tr>
            <td>{{ item.nome }}</td>
            <td>R$ {{ "%.2f"|format(item.valor|float).replace(".", ",") }}</td>
          </tr>
          {% endfor %}
          <tr>
            <td style="text-align: right;"><strong>Subtotal Serviços:</strong></td>
            <td><strong>{{ subtotal_services_str }}</strong></td>
          </tr>
        </tbody>
      </table>
      {% endif %}

      <div class="total">
        <strong>Valor Total: {{ total_str }}</strong>
      </div>
    </body>
    </html>
    ''',
                                  service_id=service_id,
                                  parts=parts,
                                  services=services,
                                  logo_base64=logo_base64,
                                  subtotal_parts_str=subtotal_parts_str,
                                  subtotal_services_str=subtotal_services_str,
                                  total_str=total_str)

    # Gerar PDF com WeasyPrint
    pdf = BytesIO()
    HTML(string=html).write_pdf(pdf)

    pdf.seek(0)
    response = make_response(pdf.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=budget_{service_id}.pdf'
    return response, None
