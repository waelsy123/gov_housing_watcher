deploy:
	cd terra &&	terraform destroy --auto-approve && \
		terraform apply --auto-approve 
