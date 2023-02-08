# gov_housing_watcher

there are several branches each correspond to specific website(agency) and user data to apply.

for instance for Wasim he has this branch https://github.com/waelsy123/gov_housing_watcher/tree/wasim-wbm
which watches WBM website, send telegram message and automatically submit form for apartment. you can try the telegram bot yourself @wbmwohnungbot https://t.me/wbmwohnungbot just send a message to the bot and it will start sending you messages

if you want it to apply for you, all you have to do is create different branch with your details then run make deploy to deployed to AWS

the main branch is configured for Abod in Vienna.

# Contribution 

TODO: 
1. currently we depend on branches to configure user details and websites, we need to enable the app to relay on env vars or configuration file for
such configuration 
