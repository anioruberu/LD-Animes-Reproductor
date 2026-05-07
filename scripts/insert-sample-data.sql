-- Insertar datos de ejemplo (ejecutar después de crear la estructura)
INSERT INTO animes (title, image, score, year, status, type, episodes, genres, synopsis, views, language, episodes_links) VALUES

-- Blue Lock vs. U-20 Japan
('Blue Lock vs. U-20 Japan', 
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/b5621ff1277ed6ad1006b0c6f14900bb.jpg',
 6.6, 2024, 'Finalizado', 'TV', 14, 
 ARRAY['Deportes', 'Shounen'],
 'Segunda Temporada de Blue Lock donde los jugadores del proyecto Blue Lock se enfrentan al equipo nacional sub-20 de Japón en un partido decisivo.',
 1600000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=SHRqaWFnVmFSdXdyMFpKbm5uYWZxZ3NUNElZQk1EK1FwbE9BNy91Sk5DTjhlVjdxZUhxZWtOSUJZWXc3bDhFWVdHZm9Ja041dG50WkNwM3I0TGxMRXc9PTo6HOl.kzhOFQjvzAVGaSlnzw--&t=f37a77dd1603e7a556aab856424cfb06"], "español latino": ["https://vidhideplus.com/embed/hxq1iu9hb4dv"]}'::jsonb),

-- Sousou no Frieren
('Sousou no Frieren',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/f446d7a2a155c6120742978fb528fb82.jpg',
 9.3, 2023, 'Finalizado', 'TV', 28,
 ARRAY['Aventura', 'Drama', 'Fantasía', 'Shounen'],
 'La maga Frieren formaba parte del grupo del héroe Himmel, quienes derrotaron al Rey Demonio tras un viaje de 10 años y devolvieron la paz al reino. Después de la aventura, cada uno siguió su camino. Sin embargo, siendo Frieren un elfo, ella vive mucho más que los humanos, y se da cuenta de lo poco que conocía a sus compañeros cuando Himmel muere de vejez.',
 2600000, 'latino',
 '{"subtitulado": ["https://www.burstcloud.co/embed/d23c30da99a935775f656d69113df45e07e04a97b5c3bf20e145cf620accab9c/Frieren-01.subes.AnimeYT.es.mp4"], "español latino": ["https://filelions.top/embed/i8citbrzpkfm"]}'::jsonb),

-- Dandadan
('Dandadan',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/2b6e3e0b4c8b7b8b8b8b8b8b8b8b8b8b.jpg',
 8.7, 2024, 'En Emisión', 'TV', 12,
 ARRAY['Acción', 'Comedia', 'Sobrenatural', 'Shounen'],
 'Momo Ayase y Ken Takakura son dos estudiantes de secundaria con creencias opuestas sobre lo paranormal. Mientras Momo cree en fantasmas, Ken cree en alienígenas. Para resolver su disputa, deciden visitar lugares relacionados con sus respectivas creencias.',
 1800000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=example"], "español latino": ["https://vidhideplus.com/embed/example"]}'::jsonb),

-- Jujutsu Kaisen
('Jujutsu Kaisen',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/9b4e3e0b4c8b7b8b8b8b8b8b8b8b8b8b.jpg',
 8.9, 2020, 'Finalizado', 'TV', 24,
 ARRAY['Acción', 'Sobrenatural', 'Shounen'],
 'Yuji Itadori es un estudiante de secundaria con habilidades físicas excepcionales. Su vida cambia cuando se encuentra con Megumi Fushiguro, un hechicero que busca un objeto maldito que los compañeros de club de Yuji han encontrado.',
 3200000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=example2"], "español latino": ["https://vidhideplus.com/embed/example2"]}'::jsonb),

-- Attack on Titan
('Shingeki no Kyojin',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/1b4e3e0b4c8b7b8b8b8b8b8b8b8b8b8b.jpg',
 9.0, 2013, 'Finalizado', 'TV', 87,
 ARRAY['Acción', 'Drama', 'Fantasía', 'Shounen'],
 'La humanidad vive dentro de ciudades rodeadas por enormes muros que los protegen de los Titanes, gigantescas criaturas humanoides que devoran humanos. La historia sigue a Eren Yeager, quien jura exterminar a todos los Titanes después de que uno de ellos destruye su ciudad natal.',
 4500000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=example3"], "español latino": ["https://vidhideplus.com/embed/example3"]}'::jsonb),

-- Demon Slayer
('Kimetsu no Yaiba',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/2b4e3e0b4c8b7b8b8b8b8b8b8b8b8b8b.jpg',
 8.7, 2019, 'Finalizado', 'TV', 44,
 ARRAY['Acción', 'Sobrenatural', 'Shounen'],
 'Tanjiro Kamado vive en las montañas con su familia. Un día, regresa a casa para encontrar a su familia masacrada por demonios, con su hermana Nezuko siendo la única superviviente, pero convertida en demonio.',
 3800000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=example4"], "español latino": ["https://vidhideplus.com/embed/example4"]}'::jsonb),

-- One Piece
('One Piece',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/3b4e3e0b4c8b7b8b8b8b8b8b8b8b8b8b.jpg',
 9.1, 1999, 'En Emisión', 'TV', 1000,
 ARRAY['Acción', 'Aventura', 'Comedia', 'Shounen'],
 'Monkey D. Luffy es un joven pirata que sueña con encontrar el tesoro más grande del mundo conocido como "One Piece" y convertirse en el próximo Rey de los Piratas.',
 5200000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=example5"], "español latino": ["https://vidhideplus.com/embed/example5"]}'::jsonb),

-- Naruto
('Naruto',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/4b4e3e0b4c8b7b8b8b8b8b8b8b8b8b8b.jpg',
 8.4, 2002, 'Finalizado', 'TV', 720,
 ARRAY['Acción', 'Artes marciales', 'Shounen'],
 'Naruto Uzumaki es un ninja adolescente que busca reconocimiento de sus compañeros y sueña con convertirse en Hokage, el líder de su aldea.',
 4800000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=example6"], "español latino": ["https://vidhideplus.com/embed/example6"]}'::jsonb),

-- Dragon Ball Z
('Dragon Ball Z',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/5b4e3e0b4c8b7b8b8b8b8b8b8b8b8b8b.jpg',
 8.8, 1989, 'Finalizado', 'TV', 291,
 ARRAY['Acción', 'Artes marciales', 'Shounen'],
 'La serie sigue las aventuras de Goku en su edad adulta mientras defiende la Tierra contra varios villanos que van desde androides hasta criaturas mágicas.',
 5500000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=example7"], "español latino": ["https://vidhideplus.com/embed/example7"]}'::jsonb),

-- Akira
('Akira',
 'https://es.web.img2.acsta.net/pictures/20/11/25/13/03/1860661.jpg',
 9.4, 1988, 'Finalizado', 'Película', 1,
 ARRAY['Acción', 'Aventura', 'Militar', 'Seinen', 'Sobrenatural'],
 '2019: sobre las ruinas de Tokio se alza la metrópolis de Neo-Tokio. Shotaro Kaneda es el líder de una banda de motociclistas. Su mejor amigo, Tetsuo, sufre un accidente y desarrolla extraños poderes psíquicos.',
 890000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=ZU9NYmRwRGw3QzN5azdVRGVVUmxLUjNUU2ZsakJMZkN4UU8wV0pZM29zR1NjQ3ZsWmsyVUhESzY2cENEWUY4bzo6HKtnzTlMuOeWo6tut6Vpmw--&t=48f878c04b5815a87f9421ca27d6b49c"], "español latino": ["https://filelions.top/embed/04imqmobm9zi"]}'::jsonb);
