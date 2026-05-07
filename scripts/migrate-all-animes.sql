-- Limpiar tabla existente (opcional)
-- DELETE FROM animes;

-- Insertar todos los animes de tu base de datos actual
INSERT INTO animes (id, title, image, score, year, status, type, episodes, genres, synopsis, views, language, episodes_links) VALUES

-- 1. Go-toubun no Hanayome the Movie
(1, 'Go-toubun no Hanayome the Movie', 
 'https://m.media-amazon.com/images/M/MV5BZWNjODg4NmQtNDcxOC00MDgyLWIxMDQtOTQ4Zjc5NTA2M2VlXkEyXkFqcGc@._V1_.jpg',
 7.8, 2022, 'Finalizado', 'Película', 1,
 ARRAY['Comedia', 'Escolar', 'Harem', 'Romance', 'Shounen'],
 'Futaro ha llevado a cinco quintillizas al punto en que pueden graduarse y perseguir sus propios sueños. Ahora, finalmente, habían llegado a su último festival escolar. Habiendo decidido hacer de esta ocasión algo para recordar, Futaro busca sus sentimientos por las cinco quintillizas.',
 457000, 'latino',
 '{"subtitulado": ["https://filelions.to/v/axd6h4u6lwpa"], "español latino": ["https://archive.org/embed/evangelion-3-0-you-can-not-redo/Evangelion%203%200%20You%20Can%20Not%20Redo.mp4"]}'::jsonb),

-- 2. Kimi no Na wa
(2, 'Kimi no Na wa.',
 'https://media.themoviedb.org/t/p/w300/iaiy3tg9QVkDpObm1IGqmbC9A5C.jpg',
 8.8, 2016, 'Finalizado', 'Película', 1,
 ARRAY['Drama', 'Romance', 'Sobrenatural'],
 'La "historia de milagros y amor" gira en torno a Mitsuha y Taki. Mitsuha es una estudiante de secundaria que vive en un pueblo rural situado en las montañas. Su padre es el alcalde y no pasa mucho por casa, ella vive con su hermana pequeña estudiante de primaria y su abuela, ni ella ni su padre participan en una campaña electoral. Ella se lamenta de que vive confinada en un pueblo rural y anhela el maravilloso estilo de vida de Tokio. Taki es un estudiante de secundaria que vive en el centro de Tokio. Él pasa su tiempo junto a sus amigos, trabajando a tiempo parcial en un restaurante italiano y está interesado en la arquitectura y las bellas artes. Un día, Mitsuha tiene un sueño en el que ella tiene el cuerpo de un hombre joven. Taki también tiene un sueño parecido y en el que él es una estudiante de secundaria en un pueblo en las montañas en él que nunca ha estado. ¿Cuál es el secreto de sus sueños?',
 457000, 'latino',
 '{"subtitulado": ["https://mega.nz/embed/!vnhDSabb!mngqeBtzdEvIyYmRBvD7vgZpAukU1hoHm4oe9uAFQdk"], "español latino": ["https://cdnst68.tokyvideo.com/videos/571/571691/mp4/df1b53d3d8cd50f9275d8afd02068e914f19fe32bada7ffc9416729833f09efb.mp4?secure=omMrdAMZwUQF9brU_zDwMg%3D%3D%2C1750788661"]}'::jsonb),

-- 3. Tenki no Ko
(3, 'Tenki no Ko: Weathering with you',
 'https://a.storyblok.com/f/178900/640x906/7385f4efdd/5585d8a027dd5ef15be1a73732b9d2131544953472_full.jpg/m/640x906',
 8.2, 2019, 'Finalizado', 'Película', 1,
 ARRAY['Drama', 'Fantasia', 'Romance'],
 'La historia se en centra en el estudiante de preparatoria Hodaka, quien abandona su hogar en una isla aislada y se muda a Tokio, pero inmediatamente pierde todo su dinero. Ahora, viviendo sus días en aislamiento, finalmente encuentra un trabajo como escritor para una revista. Luego de comenzar con su trabajo, al parecer, el clima no ha cambiado de estar lluvioso desde entonces. Es así como, una tarde, Hodaka se encuentra con una joven Ilamada Hina, quien, debido a ciertas circunstancias, vive sola con su hermano menor, con dificultades pero con una vida alegre y muy estable. Además, Hina tiene un extraño poder: detener la lluvia y despejar los cielos...',
 154000, 'latino',
 '{"subtitulado": ["https://mega.nz/embed/BnFyxDTb#WT6sYRD9YlfpKf16Ta2uemJolweySc8NUkPvA-z7Qlo/1a"], "español latino": ["https://mega.nz/embed/oqlXjAzT#RPoGjASGQe97qkTSoUxALbA6_H727Ei44TIsAG6fC-U/1a"]}'::jsonb),

-- 4. Koe no Katachi
(4, 'Koe no Katachi',
 'https://cuatrobastardosdotcom.wordpress.com/wp-content/uploads/2017/06/17883566_1297149300320816_4685229799109895910_n.jpg',
 8.9, 2016, 'Finalizado', 'Película', 1,
 ARRAY['Drama', 'Romance', 'Shounen'],
 'La historia gira en torno a Shouko, una chica sorda que, al llegar a su nuevo colegio, es despreciada por sus compañeros y sobretodo por Shouya, un chico que también sufrirá acoso escolar después. Años más tarde, Shouya se siente en la obligación de reencontrarse con Shouko.',
 692000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=UHl6Z29jckFqODdDQzRIVGFwRnJjU2VyWjRtRTFYb2Q3TjdtazlXZU9neU5najBZUmJPeFNZLzhiRkpQU0Fhcjo60M.WOe.JlGtY2JMlFicJTQ--&t=7595b2be04baf3bd1171d20c6d3a7ff7"], "español latino": ["https://latanime.org/reproductor?url=aHR0cHM6Ly9tb2pvbi5sYXRhbmltZS5vcmcvYXF1YS9mbj91cmw9aHR0cHM6Ly9waXhlbGRyYWluLmNvbS9hcGkvZmlsZS9WakxNTEcxSg=="]}'::jsonb),

-- 5. Kekkon suru tte, Hontoudesu ka
(5, 'Kekkon suru tte, Hontoudesu ka',
 'https://www.justwatch.com/images/poster/321239121/s332/365-days-to-the-wedding',
 7.0, 2024, 'Finalizado', 'TV', 12,
 ARRAY['Romance', 'Seinen'],
 'Takuya y Rika trabajan en la misma agencia de viajes de Tokio y ambos son felizmente introvertidos y solteros, pero su empresa va a abrir una nueva sucursal en Alaska el próximo año. Desesperados por evitar la mudanza, y a pesar de que apenas han hablado antes, deciden fingir un compromiso. ¿Podrán estos tranquilos compañeros de trabajo convertirse en una pareja convincente?',
 205000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=TzRPUk55N2lPWUNxSUwrQUNNYWQ0K0tzMmJaMkNkREJvOHBEL0NkdGJ5OXlXd1JOYWxLMW1idW1JcGEwNDRhSjZLT3hhN0JibVViOVl1T3NGK25aU0hWOGVWdEkzSVpFM1BQTzZDc2FhNWs9OjqAtJh8oj7ZW65Kb4AlAFGY&t=c7ed626152a79f6adf59a99ed9110f37"], "español latino": ["https://vidhideplus.com/embed/8e4on48lpeky"]}'::jsonb),

-- 6. Made in Abyss Movie 3
(6, 'Made in Abyss Movie 3: Fukaki Tamashii no Reimei',
 'https://image.tmdb.org/t/p/original/ci7IY7T7MYO0OUrl0X30LgdYNuK.jpg',
 8.62, 2020, 'Finalizado', 'Película', 1,
 ARRAY['Aventura', 'Drama', 'Fantasia', 'Misterio', 'Ciencia Ficción'],
 'Continuando con su peligroso descenso por el Abismo, Riko, Regu y su nueva amiga Nanachi llegan a la quinta capa del Abismo, El Mar de los Cadáveres. Al llegar a la estación de investigación conocida como Idofront, el trío principal se encuentra con la misteriosa Prushka, la supuesta hija de Bondrewd, quien los conduce al White Whistle responsable del oscuro pasado de Nanachi. A pesar de las apariciones de bienvenida de los residentes de Idofront, Nanachi advierte a los jóvenes aventureros que las cosas no siempre son lo que parecen.',
 56400, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=bncydXR5bFQ0NWZ4YXJHemgzNnB4VHBBMWIvN2RBRlZEV3kvSjZKWlZLM0FBU3c3ZUdlMFVGc2ZkMVhyakVrTHVoZ3hSQVBHY1U0dnFsWTJrNjRyZFE9PTo6ZP_ttbFQpmrKL6MUUbzH7w--&t=42f9c6d8b3b6858c6659b0d4b04030ac"], "español latino": ["https://vidhidepro.com/v/zqm03aa1rztj"]}'::jsonb),

-- 7. Blue Lock
(7, 'Blue Lock',
 'https://image.tmdb.org/t/p/original/cPXVLRQSU12SC5yfEEpPN0QmvWo.jpg',
 8.3, 2022, 'Finalizado', 'TV', 24,
 ARRAY['Deportes', 'Shounen'],
 'Tras una desastrosa derrota en la Copa Mundial de 2018, el equipo japonés está pasando por un mal momento. ¿Qué es lo que les falta? Un delantero que sea el mejor, alguien que pueda guiarles hasta la victoria. La federación japonesa está decidida a crear un jugador con una sed de gol única, alguien "egoísta" con el balón, un jugador que pueda ser capaz de dar la vuelta a un partido que está por perderse... Y para ello reúnen a 300 de las mejores jóvenes promesas de Japón. ¿Quién resultará el elegido como futuro líder del equipo? ¿Quién será capaz de plantar cara con su fuerza y su ego a cualquiera que se ponga en su camino? ¿Quién erá ese jugador más egoísta que nadie?',
 9300000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=MWF3UldmcXlrUHdDeWNyR0NDcHJBOHlvT0tIOVUyL1pwUUFlNmZyWFViQnVGckpTT1BTZ3M4UnRCR0k3NktDK1d0T0N3MVIwKzIwSGI5QzYzQ0ZKakE9PTo6auzmDecJQMTAWbldEi3.Gg--&t=1e40df52b69367a7dd6138fd1280e6f0"], "español latino": ["https://filelions.top/v/xsphlpauicwm"]}'::jsonb),

-- 8. Blue Lock vs. U-20 Japan
(8, 'Blue Lock vs. U-20 Japan',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/b5621ff1277ed6ad1006b0c6f14900bb.jpg',
 6.6, 2024, 'Finalizado', 'TV', 14,
 ARRAY['Deportes', 'Shounen'],
 'Segunda Temporada de Blue Lock',
 1600000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=SHRqaWFnVmFSdXdyMFpKbm5uYWZxZ3NUNElZQk1EK1FwbE9BNy91Sk5DTjhlVjdxZUhxZWtOSUJZWXc3bDhFWVdHZm9Ja041dG50WkNwM3I0TGxMRXc9PTo6HOl.kzhOFQjvzAVGaSlnzw--&t=f37a77dd1603e7a556aab856424cfb06"], "español latino": ["https://vidhideplus.com/embed/hxq1iu9hb4dv"]}'::jsonb),

-- 9. Akira
(9, 'Akira',
 'https://es.web.img2.acsta.net/pictures/20/11/25/13/03/1860661.jpg',
 9.4, 1988, 'Finalizado', 'Película', 1,
 ARRAY['Acción', 'Aventura', 'Militar', 'Seinen', 'Sobrenatural'],
 '2019: sobre las ruinas de Tokio se alza la metrópolis de Neo-Tokio, una ciudad opresiva e inhumana donde la violencia, el terrorismo y la droga son problemas cotidianos. Las sectas religiosas y los grupos extremistas, aprovechándose de la insatisfacción de los ciudadanos, cultivan el mito de AKIRA, un "niño cobaya" depositario de la "energía absoluta" cuya resurrección significaría para Japón el amanecer de una nueva era. El gobierno experimenta sobre niños con poderes psíquicos para represar la ciudad. Mientras la historia se centra en dos motociclistas callejeros, Kaneda y Tetsuo, muy buenos amigos que, cuando Tetsuo sufre un choque contra un niño psíquico en una pelea de bandas, obtiene poderes que poco a poco se incrementan, provocándole alucinaciones y poderes paranormales increíbles. Mientras Tetsuo Libera caos en la ciudad y descontrol total para demostrar sus poderes creyéndose un Dios, Kaneda lo intenta detener antes que sea su fin, o del mismo Neo-Tokio.',
 890000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=ZU9NYmRwRGw3QzN5azdVRGVVUmxLUjNUU2ZsakJMZkN4UU8wV0pZM29zR1NjQ3ZsWmsyVUhESzY2cENEWUY4bzo6HKtnzTlMuOeWo6tut6Vpmw--&t=48f878c04b5815a87f9421ca27d6b49c"], "español latino": ["https://filelions.top/embed/04imqmobm9zi"]}'::jsonb),

-- 10. Arifureta Shokugyou de Sekai Saikyou
(10, 'Arifureta Shokugyou de Sekai Saikyou',
 'https://image.tmdb.org/t/p/original/3vwcB2MtQA1VZMCljCRSrDzNzdj.jpg',
 6.72, 2019, 'Finalizado', 'TV', 13,
 ARRAY['Acción', 'Aventura', 'Fantasía', 'Harem', 'Isekai'],
 'Hajime Nagumo, de 17 años, es tu otaku promedio de todos los dias. Sin embargo, su simple vida de tirar de todas las noches y dormir en la escuela se vuelve repentinamente de cabeza cuando el, junto con el resto de su clase, es convocado a un mundo de fantasia. Son tratados como heroes y tienen el deber de salvar a la raza humana de la extincion total. Pero lo que deberia haber sido el sueño húmedo de cualquier otaku se convierte rapidamente en la pesadilla de Hajime. Mientras que el resto de su clase está bendecido con poderes divinos, el trabajo de Hajime, Synergist, solo tiene una habilidad de transmutacion única. Ridiculizado y acosado por sus compañeros de clase por ser debiles, pronto se encuentra desesperado. ¿Podra sobrevivir en este peligroso mundo de monstruos y demonios con solo el nivel de fuerza de un herrero glorificado?',
 3800000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=d3luMEI1SnlCaVJTNENDZjFtUUxYcmxtNTZma3lFNjA4TktObWRVMGEzY2s0QnVvUm5nNTBoRUxsKzUvVVIzTU9yd2tPTDlTcENtK3ZtMDdzR2d4VlFiaWZIVzJBeFA1akMvMExhcTRPM3M9Ojp__WleoT1_mLFlb5owp8d1&t=227c7ef0ccd19c939400924d9b02b2a1"], "español latino": ["https://vidhidevip.com/embed/gmpmzhjbg0fi"]}'::jsonb),

-- 11. Arifureta Shokugyou de Sekai Saikyou 2nd Season
(11, 'Arifureta Shokugyou de Sekai Saikyou 2nd Season',
 'https://image.tmdb.org/t/p/original/mK7lIy9jTyWPBC8F7MjcKyZL2Pu.jpg',
 7.18, 2022, 'Finalizado', 'TV', 13,
 ARRAY['Acción', 'Aventura', 'Fantasía', 'Harem', 'Isekai'],
 'Segunda temporada de Arifureta Shokugyou de Sekai Saikyou.',
 2400000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=d1VNVW5hTi9BbGdVWk8wdGNQRWxOalJIWnhyTS9mMjJSam1heExKWGlFSnp3bHp2ajdRMnNqUFhXM3B6MjR2Mlp2ZWdieHpQY29rUENXWjh6bEhKcnc9PTo6_YmJJ4aO0xOqXr0GXXQjLA--&t=171ee3c33c5d720975e3595c6ada6a28"], "español latino": ["https://sendvid.com/embed/8tso9t6j"]}'::jsonb),

-- 12. Arifureta Shokugyou de Sekai Saikyou 2nd Season Special
(12, 'Arifureta Shokugyou de Sekai Saikyou 2nd Season Special',
 'https://image.tmdb.org/t/p/original/mK7lIy9jTyWPBC8F7MjcKyZL2Pu.jpg',
 7.18, 2022, 'Finalizado', 'Especial', 2,
 ARRAY['Acción', 'Aventura', 'Fantasía', 'Harem', 'Isekai'],
 'Episodio no emitido incluido en el primer volumen de Blu-ray dividido en 2 partes',
 2400000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=aG4wQzJQRzA5ajdXOThnSmY1R3U4Y2MxYnU2SWthMEJaNVRzRVRoNEJrOU53RUd2QmxWSFVLaVIrNU1lVjJ1bDI1M2krT0g0a0lMbUZKeGJoM2R1TEE9PTo69b1FjwST0arsfO5ie7WanQ--&t=ecd3542a26bb64b1852739045e6559cf"], "español latino": ["https://vidhidevip.com/embed/bxfpaz5iqsz2"]}'::jsonb),

-- 13. Blue Lock: Episode Nagi
(13, 'Blue Lock: Episode Nagi',
 'https://a.storyblok.com/f/178900/1064x1596/bccf76f674/dandadan-key-art-tall.png/m/filters:quality(95)format(webp)',
 7.32, 2024, 'Finalizado', 'Pelicula', 1,
 ARRAY['Deportes', 'Shounen'],
 'La historia comienza en la eliminación de la Selección de Japón de la Copa Mundial de Fútbol de la FIFA 2018, lo que impulsa a la Unión de Fútbol de Japón a iniciar un programa de entrenamientos para preparar a un equipo de estudiantes de preparatoria que participarán en la Copa Mundial de 2022. Isagi Yoichi, un delantero, recibe una invitación para unirse a este programa poco después de que su equipo pierde una oportunidad para participar en las Nacionales, debido a que pasó el balón a su compañero con menos habilidad, quien obviamente falló el tiro, lo que denotó la cobardía de Isagi al no atreverse a terminar la jugada por sí mismo. Su entrenador será Ego Jinpachi, quien tiene la intención de acabar con la idea del "Japón débil en fútbol" aplicando un nuevo régimen de entrenamiento radical: aislar a 300 jóvenes delanteros en una institución parecida a una prisión llamada "Blue Lock", y someterlos a un riguroso entrenamiento que creará "al más grande, talentoso y egoísta delantero del mundo".',
 333600, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=UHVHaE9qb0F3UWd5ZGpYaW5jMlZPS0Y3VWRXRXJiSUN4Wm5NT1VXYU5NME1ldnZ6cDhKWEJuU3E1eExjbzdWY3h3MC8xeUYxb0lqWTkxYW8rcG5KWTBRNURpUnN4b1Joa09DRTZsWXE1RVU9OjqHQavMGBHHp5zQ2CPUgJGI&t=b0f9778c48a39e732ea08c16710abb8a"], "español latino": ["https://vidhideplus.com/embed/u61i54cu9qvs"]}'::jsonb),

-- 14. Dandadan
(14, 'Dandadan',
 'https://a.storyblok.com/f/178900/1064x1596/bccf76f674/dandadan-key-art-tall.png/m/filters:quality(95)format(webp)',
 8.7, 2024, 'Finalizado', 'TV', 12,
 ARRAY['Acción', 'Comedia', 'Shounn', 'Sobrenatural'],
 'Esta es una historia sobre Momo, una chica de secundaria, y su compañero de clase Okarun, un fan de lo oculto. Después de que Momo rescata a Okarun del acoso, comienzan a hablar. Sin embargo, se produce una discusión entre ellos ya que Momo cree en fantasmas pero niega que existan extraterrestres, y Okarun cree en extraterrestres pero niega que existan fantasmas. Para demostrarse mutuamente que lo que creen es real, Momo va a un hospital abandonado donde se ha visto un OVNI Y Okarun va a un túnel que se rumorea que está encantado. Para su sorpresa, cada uno de ellos encuentra abrumadoras actividades paranormales que trascienden la comprensión. En medio de estas dificultades, Momo despierta su poder oculto y Okarun obtiene el poder de una maldición para superar estos nuevos peligros. ¿¡Su fatídico amor también comienza!?',
 2900000, 'latino',
 '{"subtitulado": ["https://www.burstcloud.co/embed/bdfcc3c7e63ed03bebaa7a733d14304ec5774f93adf194654f979c43c294bca7/DanDaDan-01.720p.AnimeYT.es.mp4"], "español latino": ["https://jilliandescribecompany.com/e/0jfxwnh7w7ht"]}'::jsonb),

-- 15. Evangelion 1.11
(15, 'Evangelion 1.11 You Are (Not) Alone',
 'https://cdn.jkdesu.com/assets/images/animes/image/evangelion-1-11-you-are-not-alone.jpg',
 8.0, 2007, 'Finalizado', 'Película', 1,
 ARRAY['Acción', 'Aventura', 'Ciencia Ficción', 'Mecha'],
 'El argumento está basado en los episodios del 1 al 6 de la serie original. Aunque algunas situaciones se muestran de diferente forma, tales como ángulos de cámara, historias alternativas, etc. Shinji Ikari llega a Tokio-3, buscado por su padre Gendo. A su llegada, se encuentra con ejercito de la ONU tratando de detener al cuarto Angel (el tercero en la versión original), Sachiel. Rescatado por Misato Katsuragi, Shinji llega a los cuarteles generales de NERV donde se reencontrará con su padre Gendo (Supremo Comandante de NERV), con la amenaza de que si no pilotaba el EVA-01 para luchar contra Sachiel, la misteriosa Rei Ayanami, que se encontraba en malas condiciones, sería enviada a pelear; por lo que acepta. Después de la primera batalla, en la que salió victorioso, Misato lo lleva a su casa para que viva con ella, vaya a la escuela y trate de tener una vida normal. Tras todo esto comienzan a aparecer nuevos ángeles.',
 66200, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=a3luOGgxZEg0eFloekNlSVNOVS9xS1JxMlYrNVJjUEhBRzdjdm9IVndTT0RXRCs3QUhReGwrMXJHWGhBM08yQmNpVTFIbUdhK2l3WGR2Q0tObkZKRVE9PTo66SFP3rHtxJWzrVc2G0bFsw--&t=c0373aef9610078ec1df7fe5020bb33e"], "español latino": ["https://archive.org/embed/evangelion-1.11-no-estas-solo-evangelion-1-0-you-are-not-alone"]}'::jsonb),

-- 16. Evangelion 3.0+1.0
(16, 'Evangelion: 3.0+1.0',
 'https://cloudfront-us-east-1.images.arcpublishing.com/copesa/IWXUVAN7QVGLFPMFZK5PZEP6HU.jpg',
 8.8, 2016, 'Finalizado', 'Película', 1,
 ARRAY['Acción', 'Aventura', 'Ciencia Ficción', 'Mecha'],
 'Shinji Ikari todavía está a la deriva después de perder las ganas de vivir, pero el lugar al que llega le enseña lo que significa tener esperanza. Finalmente, el Proyecto de Instrumentalidad se pone en marcha y Wille hace una última y agotadora resistencia para evitar el Impacto Final',
 615000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=VWkxb2YycVpYL043blJ2K0d1czFSazhJQjB6c0pBK25Wb0o4dCtsaGEyRko0L3BNQy9ybUZiRHJ2RHZDNHlpRWpoYk81cWJtL1VhNWZGNjZZaTBhQkE9PTo6ciLFmaQEL7UXlZVW88dspQ--&t=43e84a9d17d1d8816411305bd1bc2b1b"], "español latino": ["https://drive.google.com/file/d/1xyqt27Ot83AphRSij2hkU5YVVCwDzue3/preview"]}'::jsonb),

-- 17. Evangelion 2.22
(17, 'Evangelion: 2.22 You Can (Not) Advance',
 'https://image.tmdb.org/t/p/original/7o2JoenPNslllUBtJkrVZcLKzWE.jpg',
 8.3, 2009, 'Finalizado', 'Película', 1,
 ARRAY['Acción', 'Aventura', 'Ciencia Ficción', 'Mecha'],
 'Bajo el constante ataque de los Angeles, NERV introduce dos nuevos pilotos: la misteriosa Makinami Mari Illustrious, y a la intensa Asuka Langley Shikinami. Paralelamente, Gendo Ikari y SEELE proceden con el proyecto secreto que involucra tanto a Rei como a Shinji. You Can (Not) Advance comienza con el ataque del Tercer Ángel y la aparición de una nueva piloto con el EVA-05, mientras Asuka llega a Tokio-3 con el EVA-02 durante el ataque del Séptimo Ángel. Mientras avanza, la película vuelve a mostrarnos los clásicos conflictos emocionales de la serie, añadiendo nuevas escenas y mejor animación, con un final apocalíptico sorprendente.',
 62800, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=U2o1U2o4TGRKM2MvNHhtZGlROEV2V2R2dDV0QkV4L2tvMW1XbDl2SXd4b2FqVVFnQmdwN21PL0tUOE1uTk8zbFYwenBFd1FTUjdtcUVjSEg0bGRZR3c9PTo6eWtm.3LiNLITvgzfWVxYEg--&t=becb85975bd3d8db2338e62751df4b25"], "español latino": ["https://latanime.org/reproductor?url=aHR0cHM6Ly9tZWdhLm56L2VtYmVkLyMhTE5sekNaSUshVFlYLTIwYU5ZWVJHY2dYdkdQekNXZDRNN1l3TDN2MjlWV05lS2VHN043bw=="]}'::jsonb),

-- 18. Evangelion 3.33
(18, 'Evangelion 3.33 You Can (Not) Redo',
 'https://image.tmdb.org/t/p/original/o7b5oDSpADw8SMfNd9ekqyFGCjp.jpg',
 7.64, 2012, 'Finalizado', 'Película', 1,
 ARRAY['Acción', 'Aventura', 'Ciencia Ficción', 'Mecha'],
 'La historia empieza 14 años después del Casi Tercer Impacto, el gobierno japonés decide desmantelar NERV y arrestar a su personal, durante los 14 años varios miembros de NERV obtienen su libertad y deciden formar una organización llamada WILL-E cuyo supuesto propósito es limpiar los mares, en realidad tratan de detener los planes de la nueva NERV. Ikari Shinji se despierta y ve lo que él provocó, tratando de arreglarlo, sin darse cuenta de lo que provocaría.',
 41300, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=cnpGQTBIZXFRYXdlR0cvM0FvVlBnakM0SlFscEt5WDFIcXFGZTBWdVdOOEd1Um94T2VWTFJhVWZKYUwrbXlCbExsNU95MUhXTUl3YVRyQUlQcVcxUlE9PTo6Ozy1S7zh1bxfW2WakhhRAg--&t=2e5cc5258c6fe155a7fd1c520f0af756"], "español latino": ["https://archive.org/embed/evangelion-3-0-you-can-not-redo/Evangelion%203%200%20You%20Can%20Not%20Redo.mp4"]}'::jsonb),

-- 19. Made in Abyss
(19, 'Made in Abyss',
 'https://a.storyblok.com/f/178900/640x853/0b71394d94/fdfac8e2720b6221f641c9175c5cebe01495796733_full.jpg/m/640x853',
 8.6, 2017, 'Finalizado', 'TV', 13,
 ARRAY['Aventura', 'Drama', 'Fantasia', 'Misterio', 'Ciencia Ficción'],
 'En esta obra, un enorme sistema de cuevas llamado el "Abismo" es el único lugar inexplorado del mundo. Extrañas y poderosas criaturas residen en sus profundidades, junto a preciadas reliquias que los humanos son incapaces de producir. Los misterios del Abismo fascinan a los humanos y estos bajan a sus profundidades.Los aventureros que se adentran en él son conocidos como "Cave Raiders". Una joven huérfana llamada Riko vive en el pueblo de Osu en el filo del Abismo. Su sueño es convertirse en una "Cave Raider", como su madre, y solventar los misterios del sistema de cuevas. Un día, Rico comienza a explorar las cuevas y descubre un robot con aspecto de un chico humano.',
 697000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=b0xKSjZWYkp6UVJxRGd6b29BNnRGOEZ2VE8zaGgrcEw2S3VsYkpJZ3dIbnlkTEVKYVBZcnVNb3dZVkYrb2ZJcG4yUnhJUVVNQWl3aENtZUVXUWdRc2c9PTo6RmCOEAi4QnlBvZFnzVcmgQ--&t=a00d4e8d2c0e9f0a8bb202f951fb4204"], "español latino": ["https://vidhidevip.com/v/04an0rim6cdt"]}'::jsonb),

-- 20. Made in Abyss: Retsujitsu no Ougonkyou
(20, 'Made in Abyss: Retsujitsu no Ougonkyou',
 'https://image.tmdb.org/t/p/original/w3xsBIUy0Xd78lb1XwVOYs4NHp1.jpg',
 8.66, 2022, 'Finalizado', 'TV', 12,
 ARRAY['Aventura', 'Drama', 'Fantasia', 'Misterio', 'Ciencia Ficción'],
 'Segunda temporada de Made in Abyss',
 294300, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=dlB0bVhtSkZUUnVyWDRjeDFrL0xPa2NhVktaK1lRa0hmTDFzVkpHS3NqclZsUWJEZmhTbVhhYmVOakdFUXNkVy9BVGIrQzNGUWlqS0U0Wm5yU0I4dVE9PTo6ZQ3ks9CJHmVnJP2HD7k8ww--&t=052987b249ef63ec0c9c4abcf1a40c5b"], "español latino": []}'::jsonb),

-- 21. Seirei Gensouki
(21, 'Seirei Gensouki',
 'https://a.storyblok.com/f/178900/640x853/0b71394d94/fdfac8e2720b6221f641c9175c5cebe01495796733_full.jpg/m/640x853',
 7.6, 2021, 'Finalizado', 'TV', 12,
 ARRAY['Acción', 'Aventura', 'Fantasia', 'Harem', 'Isekai', 'Romance'],
 'Su vida pasada y su vida actual se cruzan: jun chico con recuerdos de dos vidas se enfrenta a su destino! Después de que su madre fuera asesinada siendo pequeño, el huérfano Rio luchó con todas sus fuerzas para sobrevivir en los barrios bajos. Un día se despierta con los recuerdos de Haruto Amakwa, quien murió en un accidente mientras soñaba con reunirse con su amigo de la infancia, y Rio se da cuenta de que se ha reencarnado en un mundo de espadas y brujería. No solo eso, sino que, tras ayudar a detener un intento de secuestro de una princesa con la que se tropezó, acaba inscrito en una famosa escuela donde se reúnen los hijos de la nobleza... Rio intentará ascender desde lo más bajo de una sociedad jerarquizada y vivirá nuevos encuentros y despedidas mientras lucha por superar el destino.',
 22000000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=cXR6U2lyYUtDOTVJclBmb29vQzdqcGh1aDZUZExuN1MwMVJuL2U0NEZ1Sk5uWk1oVG54Z3Y5Tm5mUVJwbnBNUTlGclMvVjYvbGh3MHJtbDV0c1N4Qnc9PTo6QasBFQjNKXbDnQWoBEp8bw--&t=5e13b84d0a6bc07cd37a315deb97e2b8"], "español latino": ["https://vidhidepre.com/embed/mkeqeru3phcg"]}'::jsonb),

-- 22. Seirei Gensouki 2
(22, 'Seirei Gensouki 2',
 'https://media.themoviedb.org/t/p/w300/nkkDhwL9p0UlWXtPnKYefCRX1j8.jpg',
 6.9, 2024, 'Finalizado', 'TV', 12,
 ARRAY['Acción', 'Aventura', 'Fantasia', 'Harem', 'Isekai', 'Romance'],
 'Segunda Temporada de Seirei Gensouki',
 754000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=OTB0VVJWc0s0SVBHTE5uWUwwZjlzUmFBLzVPMEhiWStFanhvay9Dc0NpbUdNSXN2Nk1TTklJa3ladE5pWWx1dkRYQU1sQldvMHdwc0MxelAvMlNSdDJYQWc0d05FbmJWaDcvVHE5R2RXYTg9Ojqh2rABMTIPq.CEiteRVKKm&t=e0bd98397dce9bbba46990d4e9f17eca"], "español latino": ["https://vidhideplus.com/embed/493amxdzqxpc"]}'::jsonb),

-- 23. Sousou no Frieren
(23, 'Sousou no Frieren',
 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=480,height=720/catalog/crunchyroll/f446d7a2a155c6120742978fb528fb82.jpg',
 9.3, 2023, 'Finalizado', 'TV', 28,
 ARRAY['Aventura', 'Drama', 'Fantasía', 'Shounen'],
 'La maga Frieren formaba parte del grupo del héroe Himmel, quienes derrotaron al Rey Demonio tras un viaje de 10 años y devolvieron la paz al reino. Frieren es una elfa de más de mil años de vida, así que al despedirse de Himmel y sus compañeros promete que regresará para verlos y parte de viaje sola. Al cabo de cincuenta años, Frieren cumple su promesa y acude a visitar a Himmel y al resto. Aunque ella no ha cambiado, Himmel y los demás han envejecido y están en el final de sus vidas. Cuando Himmel muere, Frieren se arrepiente de no haber pasado más tiempo a su lado conociéndolo, así que emprende un viaje para conocer mejor a sus antiguos compañeros, a las personas y descubrir más del mundo.',
 2600000, 'latino',
 '{"subtitulado": ["https://www.burstcloud.co/embed/d23c30da99a935775f656d69113df45e07e04a97b5c3bf20e145cf620accab9c/Frieren-01.subes.AnimeYT.es.mp4"], "español latino": ["https://filelions.top/embed/i8citbrzpkfm"]}'::jsonb),

-- 24. Maou 2099
(24, 'Maou 2099',
 'https://media.themoviedb.org/t/p/original/mU7QgTm2WadwVoT7jDyMY9Czpsj.jpg',
 7.5, 2024, 'Finalizado', 'TV', 12,
 ARRAY['Acción', 'Fantasía', 'Ciencia Ficción'],
 'La metrópolis ciberpunk de Shinjuku, una enorme ciudad-estado adornada con carteles de neón, altísimos rascacielos y la última tecnología punta. Es aquí, en el año 2099 de la Era Fundida, donde el legendario Señor de los Demonios Veltol tiene su segunda venida cinco siglos después. Pero este paisaje no se parece en nada al que conquistó hace tantos años, ya que la fusión de magia e ingeniería ha elevado la civilización a cotas deslumbrantes y sin precedentes. Puede que Veltol haya quedado reducido a una nota histórica a pie de página, pero no te equivoques… ¡este valiente nuevo mundo será suyo!',
 780000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=b3NGNzA3M0pwQW9LeHcveVQ2Z0hidHU0OC9HNDdYdFZxY2NzMlVsaDFHZGhCN2ZoR2lWUnQ3aGlEM3ZPYTUrcGdOQUtaUnppWlJQZXJFUlZaR2lXbWc9PTo6v.kpKiQB5pJrod7L66Sr6g--&t=718b5059276ddfb1fa3dffff6374fe38"], "español latino": ["https://vidhidehub.com/embed/84szqg52coa6"]}'::jsonb),

-- 25. Arifureta Shokugyou de Sekai Saikyou Season 3
(25, 'Arifureta Shokugyou de Sekai Saikyou Season 3',
 'https://image.tmdb.org/t/p/original/ameFe9Hw44ary4cr4MFiMAIQLZU.jpg',
 7.4, 2024, 'Finalizado', 'TV', 16,
 ARRAY['Acción', 'Aventura', 'Fantasía', 'Harem', 'Isekai'],
 'Tercera temporada de Arifureta Shokugyou de Sekai Saikyou.',
 496000, 'latino',
 '{"subtitulado": ["https://jkanime.net/jkplayer/um?e=dlJkTG9UaGpCVmxCV05LcHByU05RVzlSQzA0SFE3bC9yU3RPay9ESEo5ZnNnRUE3STlqVitpZnM0Vmp2bE56M25DY3l2aGV4OWVmakZpUTBGYlNHSG1tNUxRcHFpdzdxL0RWYklKOEx3eGc9OjqwPAJBWdtTZ2sKqm_Lp.cl&t=0ffaba8b431c997988bddc3b1a44c1fd"], "español latino": ["https://vidhidehub.com/embed/x1dez2gi130i"]}'::jsonb)

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    image = EXCLUDED.image,
    score = EXCLUDED.score,
    year = EXCLUDED.year,
    status = EXCLUDED.status,
    type = EXCLUDED.type,
    episodes = EXCLUDED.episodes,
    genres = EXCLUDED.genres,
    synopsis = EXCLUDED.synopsis,
    views = EXCLUDED.views,
    language = EXCLUDED.language,
    episodes_links = EXCLUDED.episodes_links,
    updated_at = NOW();

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_animes FROM animes;
SELECT title, year, episodes FROM animes ORDER BY id LIMIT 5;
