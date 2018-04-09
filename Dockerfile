FROM node

ARG dumb_init_version=1.2.0
RUN wget -nv https://github.com/Yelp/dumb-init/releases/download/v${dumb_init_version}/dumb-init_${dumb_init_version}_amd64.deb && \
    dpkg -i dumb-init_*.deb && \
    rm dumb-init_*.deb


ARG botpress_version=beta
RUN npm install --unsafe-perm -g --verbose botpress@${botpress_version}

# VOLUME ['/data']
WORKDIR '/bot'
EXPOSE 3000

# CMD ["/usr/bin/dumb-init", "--", "bp", "start", "--watch"]
CMD ["node","--inspect=0.0.0.0", "/usr/local/lib/node_modules/botpress/bin/botpress", "start", "--watch"]
