import csv


def writeResultsCsv(path, suite_name, case_name, result, comment):
    with open(path, 'a', encoding='UTF8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([suite_name, case_name, result, comment])
