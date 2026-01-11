from colorama import Fore, Back, init

# init(autoreset=True)

payment_term = 12
cooloff = 2
payout = 25

payout_amount = 21210
lumpsum = 792000
nps_investment = 40000

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
            print(Back.WHITE + Fore.RED, end="")
        else:
        	print(Back.RESET, end="")
    else:
    	print(Back.RESET + Fore.MAGENTA, end="") 
    print(round(nps_initial))
    
    
