# Решение задания №2 для курсов kottans
Суть задания заклюается в написании функции `intersect`, которая принимает на вход два многоугольника и возвращает их пересечение. Решение находится в файле `solution.js` и не использует библиотек. Функция работает для многоугольников с самопересечениями, но, к сожалению, не поддерживает многоугольники с дырками.
## Запуск
Достаточно открыть index.html в последних версиях Chrome или Firefox, чтобы увидеть визуализацию примера работы программы. Или просто глянуть [здесь](http://yevs.github.io/polygons-intersection/)
## Прогон тестов
Опять же, достаточно открыть `tests/tests.html` в одной из последних версий Chrome или Firefox. Для unit тестов была использована библиотека QUnit.js
## Примечания
В глобальной системе видимости есть функции `intersect` и `intersects`, т.к. в хоть самом задании и сказано, что функция должна называться `intersect`, в предложеном шаблоне проекта функция называется `intersects`

¯\\\_(ツ)\_/¯
