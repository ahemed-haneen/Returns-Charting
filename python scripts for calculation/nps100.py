from colorama import Fore, init

# init(autoreset=True)

payment_term = 12
cooloff = 2
payout = 25

payout_amount = 0
lumpsum = 0
nps_investment = 100000

nps_initial = nps_investment

print(Fore.GREEN + str(nps_initial))
for i in range(42):
    nps_initial = nps_initial * (1.1)
    
    if i < payment_term:
        nps_initial = nps_initial + nps_investment
        print(Fore.YELLOW, end="")
    else:
        nps_initial = nps_initial + 16000
        print(Fore.CYAN, end="")
    
    if i < payout:
        nps_initial = nps_initial + payout_amount
        
        if i == payout - 1:
            nps_initial = nps_initial + lumpsum
        
    print(round(nps_initial))
    
    
