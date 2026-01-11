from colorama import Fore, Back, init

# init(autoreset=True)

# Valores actualizados según la imagen
payment_term = 10  # Años de pago (Column D)
cooloff = 0        # Los pagos empiezan casi inmediatamente después (Year 11)
payout = 10        # Duración del beneficio (Year 11 to 25)

nps_payouts = {
    # Year: payout amount (years 1..9 => 0)
    10: 204752,
    11: 210854,
    12: 216659,
    13: 222353,
    14: 227526,
    15: 232792,
    16: 238149,
    17: 243585,
    18: 249085,
    19: 254625,
    20: 260199,
    21: 265912,
    22: 271769,
    23: 277772,
    24: 283926,
    25: 290234,
}

lumpsum = 3153682       # Pago final total en el año 25 (Column L)
nps_investment = 100000 # Inversión anual

nps_initial = 0

print(Fore.GREEN + str(nps_initial))

# El bucle ahora corre por 25 años como en la imagen
for i in range(1, 26):
    # Crecimiento neto estimado (ajustado a 14% para reflejar cargos)
    nps_initial = nps_initial * (1.14)
    
    if i <= payment_term:
        nps_initial = nps_initial + nps_investment
        print(Fore.YELLOW, end="")
    else:
        # No hay aportaciones adicionales después del año 10
        nps_initial = nps_initial + 0 
        print(Fore.CYAN, end="")
    
    # Simulación de retiros (Payouts) usando la programación por año
    payout_for_year = nps_payouts.get(i, 0)
    if payout_for_year > 0 and i < 25:
        nps_initial = nps_initial - payout_for_year
        print(Back.RESET, end="")
    elif i == 25:
        # En el último año se fija el lumpsum (como antes)
        # still report the payout amount in data but final corpus is set to lumpsum
        print(Back.WHITE + Fore.RED, end="")
        nps_initial = lumpsum
    else:
        print(Back.RESET + Fore.MAGENTA, end="")
        
    print(round(nps_initial))