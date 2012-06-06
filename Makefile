APPNAME=sweetspot

all:
	@echo "Nothing to build"

install:
	mkdir -p ${DESTDIR}/usr/share/${APPNAME}
	cp -a audio ${DESTDIR}/usr/share/${APPNAME}/
	cp -a css ${DESTDIR}/usr/share/${APPNAME}/
	cp -a fonts ${DESTDIR}/usr/share/${APPNAME}/
	cp -a images ${DESTDIR}/usr/share/${APPNAME}/
	cp -a js ${DESTDIR}/usr/share/${APPNAME}/
	cp -a _locales ${DESTDIR}/usr/share/${APPNAME}/
	cp icon.png ${DESTDIR}/usr/share/${APPNAME}/
	cp *.html ${DESTDIR}/usr/share/${APPNAME}/
	cp manifest.json ${DESTDIR}/usr/share/${APPNAME}/
	cp LICENSE ${DESTDIR}/usr/share/${APPNAME}/
	mkdir -p ${DESTDIR}/usr/share/applications
	cp ${APPNAME}.desktop ${DESTDIR}/usr/share/applications/
	mkdir -p ${DESTDIR}/usr/share/pixmaps
	cp icon.png ${DESTDIR}/usr/share/pixmaps/${APPNAME}.png
