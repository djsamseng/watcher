import json
import pika

def onQueueMessage(ch, method, properties, body):
    print("Received %r" % body)


connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()
channel.queue_declare(queue="hello")
channel.basic_consume(queue="hello",
                      auto_ack=True,
                      on_message_callback=onQueueMessage)

print("To exit press Ctrl+C")
channel.start_consuming()
