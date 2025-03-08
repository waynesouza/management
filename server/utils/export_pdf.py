import json
import pdfkit
from flask import render_template_string, make_response
from server.models import Budget


def export_budget_pdf(service_id):
    budget = Budget.query.filter_by(service_id=service_id).first()
    if not budget:
        return None, "Budget not found"

    try:
        items = json.loads(budget.data)
    except Exception as e:
        return None, f"Error processing budget data: {str(e)}"

    html = render_template_string('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Budget - Service {{ service_id }}</title>
      <style>
        body { font-family: Arial, sans-serif; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h2>Budget - Service {{ service_id }}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {% for item in items %}
          <tr>
            <td>{{ item.nome }}</td>
            <td>{{ item.valor }}</td>
          </tr>
          {% endfor %}
        </tbody>
      </table>
    </body>
    </html>
    ''', service_id=service_id, items=items)

    try:
        pdf = pdfkit.from_string(html, False)
    except Exception as e:
        return None, f"Error generating PDF: {str(e)}"

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=budget_{service_id}.pdf'
    return response, None
