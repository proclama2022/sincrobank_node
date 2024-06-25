def sum_even_numbers(numbers):
    even_numbers = []
    # Primo ciclo per trovare tutti i numeri pari
    for num in numbers:
        if num % 2 == 0:
            even_numbers.append(num)
    
    # Secondo ciclo per calcolare la somma dei numeri pari
    total_sum = 0
    for even in even_numbers:
        total_sum += even

    return total_sum

# Lista di numeri per testare la funzione
test_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Chiamata alla funzione e stampa del risultato
result = sum_even_numbers(test_numbers)
print(f"La somma dei numeri pari è: {result}")
