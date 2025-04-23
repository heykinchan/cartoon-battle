#!/bin/bash

LOGFILE="./backend.log"
port="4444"

start() {
    # check if port is in use
    if lsof -i :$port > /dev/null; then
        echo "Port $port is already in use. Please check the running service."
        return 1
    fi

    # attempt start new service
    echo 'Starting service…' >&2
    npx prisma generate >&2
    npx nx serve > "$LOGFILE" 2>&1 &
    sleep 10  # Give the service some time to start and bind to the port
    PID=$(lsof -t -i:$port)  # Find the PID of the process listening on port
    if [ -z "$PID" ]; then
        echo 'Failed to start service or find a listening PID' >&2
        return 1
    fi
    echo "Service started with PID $PID" >&2
}

stop() {
    echo "Attempting to stop service on port $port."

    # Find the process listening on the specified port
    PID=$(lsof -t -i:$port)
    if [ -z "$PID" ]; then
        echo "No service is running on port $port."
        return 1
    else
        # Attempt to terminate the process
        kill -15 $PID
        if [ $? -eq 0 ]; then
            echo "Service stopped successfully."
            return 0
        else
            echo "Failed to stop service."
            return 1
        fi
    fi
}

BR() {
    echo "Building service..." >&2
    npm run build comp5347-2024-l8-g4-a2 --prod >&2
    cp ./.env ./dist/comp5347-2024-l8-g4-a2/.env >&2
    cp ./dist/run.sh ./dist/comp5347-2024-l8-g4-a2/run.sh >&2
    cd ./dist/comp5347-2024-l8-g4-a2 >&2
    chmod +x run.sh >&2
    ./run.sh restart >&2
}

restart() {
    echo "Restarting service..."
    stop
    start

}

out() {
    tail -20 "$LOGFILE"
}

status() {
    echo "Checking service status on port $port..."
    if lsof -i :$port > /dev/null; then
        PID=$(lsof -t -i:$port)
        echo -e "\e[32m●\e[0m Service is running with PID $PID. \e[32m●\e[0m"
    else
        echo -e "\e[31m●\e[0m Service is not running on port $port. \e[31m●\e[0m"
    fi
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    restart
    ;;
  status)
    status
    ;;
  BR)
    BR
    ;;
  tail)
    out
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|BR(build and run)|tail}"
esac