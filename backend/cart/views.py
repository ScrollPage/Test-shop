from django.shortcuts import render, get_object_or_404
from api.models import Product
from account.models import Account
from cart.models import Order, OrderItem
from cart.help_funcs import generate_token
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

def add_to_cart(request):
    data = request.POST
    email = data['email']
    uid = data['uid']
    amount = int(data['amount'])
    u = get_object_or_404(Account, email = email)
    p = Product.objects.get(id = uid)
    user_order = Order.objects.get(owner = u)

    order_item = user_order.items.filter(product = p).first()
    if order_item:
        pass
    else:
        order_item = user_order.items.create()
        order_item.product = p

    order_item.amount += amount
    order_item.save()
    
    user_order.total_price += p.price * amount
    user_order.total_count += amount
    ref_code = user_order.ref_code
    if ref_code == '':
        user_order.ref_code = generate_token(u.email)
    user_order.save()

    return HttpResponse('ok')

def delete_from_cart(request):
    data = request.POST
    email = data['email']
    uid = data['uid']
    amount = int(data['amount'])
    u = get_object_or_404(Account, email = email)
    p = Product.objects.get(id = uid)
    user_order = Order.objects.get(owner = u)
    order_item = user_order.items.filter(product = p).first()
    if order_item:
        if order_item.amount <= amount:
            order_item.delete()
        else:
            order_item.amount -= amount
            order_item.save()

        user_order.total_price -= p.price * amount
        user_order.total_count -= amount
        user_order.save()
    
    return HttpResponse('ok')


def clear_cart(request):
    data = request.POST
    email = data['email']
    u = Account.objects.get(email = email)
    order_to_clear = Order.objects.get(owner = u)
    for item in order_to_clear.get_all_items():
       item.delete()
    
    order_to_clear.total_price = 0
    order_to_clear.total_count = 0
    order_to_clear.save() 
    
    return HttpResponse('ok')

