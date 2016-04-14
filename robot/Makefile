install:
	mkdir -p /var/paths/
	chown pi /var/paths/
	chmod a+rw /var/paths/
	cp battleplan /etc/init.d/battleplan
	chmod 755 /etc/init.d/battleplan
	update-rc.d battleplan defaults
	@echo "reboot to start the service"
