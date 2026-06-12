package main

import (
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

// This is a stub for the Kafka consumer that listens to nexus.fir.events
func StartKafkaConsumer(broker string, topics []string) {
	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": broker,
		"group.id":          "alert-service-group",
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		log.Printf("Failed to create consumer: %s\n", err)
		return
	}

	err = c.SubscribeTopics(topics, nil)
	if err != nil {
		log.Printf("Failed to subscribe: %s\n", err)
		return
	}

	go func() {
		for {
			msg, err := c.ReadMessage(-1)
			if err == nil {
				fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
				// TODO: Process event and trigger alerts if rules match
			} else {
				// The client will automatically try to recover from all errors.
				fmt.Printf("Consumer error: %v (%v)\n", err, msg)
			}
		}
	}()
}
