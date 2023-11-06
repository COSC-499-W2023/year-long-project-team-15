import time
from library.write_results import writeResultsCsv


def tryExcept(func):
    def wrapper(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception as e:
            print(e)
            writeResultsCsv(r'C:\Users\macvi\PycharmProjects\rewardly\results\android_results.csv', 'Merchant Portal Login Suite', 'test case function name: ' + func.__name__, 'FAILED',
                                 'Exception thrown during test case execution. View console log.')
            time.sleep(5)

    return wrapper
