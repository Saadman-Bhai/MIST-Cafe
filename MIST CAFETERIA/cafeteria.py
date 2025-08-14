# save as cafeteria.py
from flask import Flask, render_template_string, request
import csv
from datetime import datetime

app = Flask(__name__)

# HTML Templates
CUSTOMER_FORM = """
<h1>MIST Cafeteria Order</h1>
<form method="post">
  Name: <input name="name" required><br>
  Dept: <input name="dept" required><br>
  Tower: <input name="tower" required><br>
  Room: <input name="room" required><br>
  Items: <textarea name="items" required></textarea><br>
  <input type="checkbox" name="delivery"> Delivery (+5৳)<br>
  <button type="submit">Submit Order</button>
</form>
"""

SELLER_VIEW = """
<h1>Orders Dashboard</h1>
<table border="1">
  <tr>
    <th>Time</th><th>Name</th><th>Dept</th><th>Location</th><th>Items</th><th>Delivery</th>
  </tr>
  {% for order in orders %}
  <tr>
    <td>{{ order[0] }}</td>
    <td>{{ order[1] }}</td>
    <td>{{ order[2] }}</td>
    <td>Tower {{ order[3] }}, Room {{ order[4] }}</td>
    <td>{{ order[5] }}</td>
    <td>{{ "Yes" if order[6] == "True" else "No" }}</td>
  </tr>
  {% endfor %}
</table>
"""

@app.route('/', methods=['GET', 'POST'])
def customer():
    if request.method == 'POST':
        with open('orders.csv', 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                request.form['name'],
                request.form['dept'],
                request.form['tower'],
                request.form['room'],
                request.form['items'],
                request.form.get('delivery', 'False')
            ])
        return "Order Submitted! Thank you 🎉"
    return CUSTOMER_FORM

@app.route('/seller')
def seller():
    orders = []
    try:
        with open('orders.csv', 'r') as f:
            reader = csv.reader(f)
            orders = list(reader)
    except FileNotFoundError:
        pass
    return render_template_string(SELLER_VIEW, orders=orders)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)