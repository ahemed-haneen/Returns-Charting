from colorama import Fore, Back, init

# init(autoreset=True)

payment_term = 12
cooloff = 2
payout = 25

payout_amount = 130338
lumpsum = 1440000
nps_investment = 0

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
    
    if i >= cooloff + payment_term and i < cooloff + payment_term + payout:
        nps_initial = nps_initial + payout_amount
        
        if i == cooloff + payment_term + payout - 1:
            nps_initial = nps_initial + lumpsum
            print(Back.WHITE + Fore.RED, end="")
        else:
        	print(Back.RESET, end="")
    else:
    	print(Back.RESET + Fore.MAGENTA, end="") 
    print(round(nps_initial))
    
    
