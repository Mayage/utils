#include <stdio.h>
#include <pthread.h>
#include <unistd.h>
#include <semaphore.h>

sem_t sem1;
sem_t sem2;
//PV操作：实现同步，先实现func1，后实现func2

void *myThread1(void)
{
    int i;

    for (i = 0; i < 5; i++)
    {
        sem_wait(&sem1);
        printf("Hello\n");
        sleep(1);
        sem_post(&sem2);
    }
}

void *myThread2(void)
{
    int i;

    for (i = 0; i < 5; i++)
    {
        sem_wait(&sem2);
        printf("world!\n");
        sleep(1);
        sem_post(&sem1);
    }
}

int main()
{
    int ret = 0;
    pthread_t id1;
    pthread_t id2;

    sem_init(&sem1, 0, 1);
    sem_init(&sem2, 0, 0);

    ret = pthread_create(&id1, NULL, (void *)myThread1, NULL);

    if (ret)
    {
        printf("Create pthread error\n");
        return 1;
    }

    ret = pthread_create(&id2, NULL, (void *)myThread2, NULL);

    if (ret)
    {
        printf("Create pthread error\n");
        return 1;
    }

    pthread_join(id1, NULL);
    pthread_join(id2, NULL);

    sem_destroy(&sem1);
    sem_destroy(&sem2);

    return 0;
}