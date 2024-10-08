FROM ghcr.io/openzipkin/zipkin-slim:latest
ENV STORAGE_TYPE=mem
ENV SELF_TRACING_ENABLED=true
ENV JAVA_OPTS="-Xms128m -Xmx128m -XX:+ExitOnOutOfMemoryError"
EXPOSE 9411
CMD ["--logging.level.zipkin2=DEBUG"]