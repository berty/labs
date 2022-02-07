package main

import (
	"os"
	"os/signal"
	"syscall"

	"berty.tech/labs/go/bind/labs"
)

func main() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	conf := labs.NewConfig()
	conf.GRPCAddr = "127.0.0.1:9314"

	lab, err := labs.NewLabs(conf)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := lab.Close(); err != nil {
			panic(err)
		}
	}()

	<-c
}
