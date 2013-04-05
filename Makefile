APPNAME=sweetspot
BROWSER=chromium-browser

all:
	@echo "Nothing to build"

install:
	mkdir -p ${DESTDIR}/usr/share/${APPNAME}
	cp -a app/* ${DESTDIR}/usr/share/${APPNAME}/
	cp icon_128.png ${DESTDIR}/usr/share/${APPNAME}/
	cp README.txt ${DESTDIR}/usr/share/${APPNAME}/
	cp manifest.json ${DESTDIR}/usr/share/${APPNAME}/
	cp LICENSE ${DESTDIR}/usr/share/${APPNAME}/
	mkdir -p ${DESTDIR}/usr/share/applications
	cp ${APPNAME}.desktop ${DESTDIR}/usr/share/applications/
	sed -i -e 's/%BROWSER%/${BROWSER}/' ${DESTDIR}/usr/share/applications/${APPNAME}.desktop
	mkdir -p ${DESTDIR}/usr/share/pixmaps
	cp icon_128.png ${DESTDIR}/usr/share/pixmaps/${APPNAME}.png
