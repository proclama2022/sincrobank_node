def sum_even_numbers(numbers):
    even_numbers = []
    # Primo ciclo per trovare tutti i numeri pari
    for num in numbers:
        if num % 2 == 0:
            even_numbers.append(num)

# Lista di numeri per testare la funzione
test_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Chiamata alla funzione e stampa del risultato
result = sum_even_numbers(test_numbers)
print(f"La somma dei numeri pari è: {result}")
