-- 0008: real product photos, brand logos and category images (from "Hình ảnh đưa web.xlsx").
-- Safe to run more than once. Only replaces the drawn demo images / bundled logos; anything uploaded
-- in Admin (Supabase Storage URLs) is left untouched. Images live in the site's /public/img folder.

-- Brands: add the new ones, refresh bundled logos.
insert into public.brands (slug, name, logo_url, sort_order) values
  ('siemens', 'Siemens', '/img/th/siemens.png', 1),
  ('schneider-electric', 'Schneider Electric', '/img/th/schneider-electric.png', 2),
  ('mitsubishi-electric', 'Mitsubishi Electric', '/img/th/mitsubishi-electric.png', 3),
  ('omron', 'Omron', '/img/th/omron.png', 4),
  ('abb', 'ABB', '/img/th/abb.png', 5),
  ('festo', 'Festo', '/img/th/festo.png', 6),
  ('smc', 'SMC', '/img/th/smc.png', 7),
  ('sick', 'SICK', '/img/th/sick.png', 8),
  ('ifm', 'ifm electronic', '/img/th/ifm.png', 9),
  ('phoenix-contact', 'Phoenix Contact', '/img/th/phoenix-contact.png', 10),
  ('autonics', 'Autonics', '/img/th/autonics.png', 11),
  ('hanyoung-nux', 'Hanyoung Nux', '/img/th/hanyoung-nux.png', 12),
  ('idec', 'IDEC', null, 13),
  ('pepperl-fuchs', 'Pepperl+Fuchs', '/img/th/pepperl-fuchs.png', 14),
  ('airtac', 'AirTAC', '/img/th/airtac.png', 15),
  ('ls-electric', 'LS Electric', '/img/th/ls-electric.png', 16),
  ('mikro', 'Mikro', '/img/th/mikro.png', 17),
  ('weidmuller', 'Weidmüller', '/img/th/weidmuller.png', 18),
  ('mean-well', 'Mean Well', '/img/th/mean-well.png', 19),
  ('sang-jin', 'Sang Jin', '/img/th/sang-jin.png', 20),
  ('altek-kabel', 'Altek Kabel', '/img/th/altek-kabel.png', 21),
  ('cadivi', 'CADIVI', '/img/th/cadivi.png', 22),
  ('lion', 'LION', '/img/th/lion.png', 23),
  ('eaton', 'Eaton', '/img/th/eaton.png', 24),
  ('delta', 'Delta', '/img/th/delta.png', 25),
  ('rockwell-automation', 'Rockwell Automation', '/img/th/rockwell-automation.png', 26),
  ('fuji-electric', 'Fuji Electric', '/img/th/fuji-electric.png', 27),
  ('finder', 'Finder', '/img/th/finder.png', 28),
  ('turck-banner', 'Turck Banner', '/img/th/turck-banner.png', 29),
  ('selec', 'Selec', '/img/th/selec.png', 30),
  ('pro-face', 'Pro-face', '/img/th/pro-face.png', 31),
  ('yaskawa', 'Yaskawa', '/img/th/yaskawa.png', 32),
  ('weintek', 'Weintek', '/img/th/weintek.png', 33),
  ('wago', 'WAGO', '/img/th/wago.png', 34),
  ('endress-hauser', 'Endress+Hauser', '/img/th/endress-hauser.png', 35),
  ('klemsan', 'Klemsan', '/img/th/klemsan.png', 36),
  ('puls', 'PULS', '/img/th/puls.png', 37),
  ('bosch-rexroth', 'Bosch Rexroth', '/img/th/bosch-rexroth.png', 38),
  ('beckhoff', 'Beckhoff', '/img/th/beckhoff.png', 39),
  ('danfoss', 'Danfoss', '/img/th/danfoss.png', 40),
  ('fatek', 'Fatek', '/img/th/fatek.png', 41),
  ('parker', 'Parker', '/img/th/parker.png', 42),
  ('pilz', 'Pilz', '/img/th/pilz.png', 43),
  ('panasonic', 'Panasonic', '/img/th/panasonic.png', 44),
  ('koyo', 'Koyo', '/img/th/koyo.png', 45),
  ('dinkle', 'Dinkle', '/img/th/dinkle.png', 46),
  ('hensel', 'Hensel', '/img/th/hensel.png', 47),
  ('norgren', 'Norgren', '/img/th/norgren.png', 48),
  ('schmersal', 'Schmersal', '/img/th/schmersal.png', 49),
  ('azbil', 'Azbil', '/img/th/azbil.png', 50),
  ('skf', 'SKF', '/img/th/skf.png', 51),
  ('asahi', 'Asahi', '/img/th/asahi.png', 52),
  ('nsk', 'NSK', '/img/th/nsk.png', 53),
  ('ntn', 'NTN', '/img/th/ntn.png', 54),
  ('rang-dong', 'Rạng Đông', '/img/th/rang-dong.png', 55),
  ('duhal', 'Duhal', '/img/th/duhal.png', 56),
  ('philips', 'Philips', '/img/th/philips.png', 57),
  ('himel', 'Himel', '/img/th/himel.png', 58),
  ('samwha', 'Samwha', '/img/th/samwha.png', 59),
  ('nuintek', 'Nuintek', '/img/th/nuintek.png', 60),
  ('honeywell', 'Honeywell', '/img/th/honeywell.png', 61),
  ('chint', 'CHINT', null, 62)
on conflict (slug) do update set logo_url = excluded.logo_url
  where excluded.logo_url is not null and (brands.logo_url is null or brands.logo_url like '/brands/%' or brands.logo_url like '/img/th/%');

-- Categories: photo for each group / sub-category that has a matching picture.
update public.categories c set image_url = v.img from (values
  ('thiet-bi-dong-cat', '/img/dm/thiet-bi-dong-cat.jpg'),
  ('mcb', '/img/dm/mcb.jpg'),
  ('mccb', '/img/dm/mccb.jpg'),
  ('contactor-khoi-dong-tu', '/img/dm/contactor-khoi-dong-tu.jpg'),
  ('contactor', '/img/dm/contactor.jpg'),
  ('khoi-dong-tu', '/img/dm/khoi-dong-tu.jpg'),
  ('ro-le-nhiet', '/img/dm/ro-le-nhiet.jpg'),
  ('relay-timer', '/img/dm/relay-timer.jpg'),
  ('relay-trung-gian', '/img/dm/relay-trung-gian.jpg'),
  ('relay-bao-ve', '/img/dm/relay-bao-ve.jpg'),
  ('timer', '/img/dm/timer.jpg'),
  ('bien-tan-khoi-dong-mem', '/img/dm/bien-tan-khoi-dong-mem.jpg'),
  ('bien-tan', '/img/dm/bien-tan.jpg'),
  ('khoi-dong-mem', '/img/dm/khoi-dong-mem.jpg'),
  ('phu-kien-bien-tan', '/img/dm/phu-kien-bien-tan.jpg'),
  ('tu-dong-hoa', '/img/dm/tu-dong-hoa.jpg'),
  ('plc', '/img/dm/plc.jpg'),
  ('hmi', '/img/dm/hmi.jpg'),
  ('servo', '/img/dm/servo.jpg'),
  ('module-mo-rong', '/img/dm/module-mo-rong.jpg'),
  ('cam-bien-dieu-khien-nhiet', '/img/dm/cam-bien-dieu-khien-nhiet.jpg'),
  ('cam-bien-tiem-can', '/img/dm/cam-bien-tiem-can.jpg'),
  ('cam-bien-quang', '/img/dm/cam-bien-quang.jpg'),
  ('can-nhiet', '/img/dm/can-nhiet.jpg'),
  ('encoder', '/img/dm/encoder.jpg'),
  ('tu-bu-cuon-khang', '/img/dm/tu-bu-cuon-khang.jpg'),
  ('tu-bu', '/img/dm/tu-bu.jpg'),
  ('cuon-khang', '/img/dm/cuon-khang.jpg'),
  ('bo-dieu-khien-tu-bu', '/img/dm/bo-dieu-khien-tu-bu.jpg'),
  ('bien-dong-dong-ho-do', '/img/dm/bien-dong-dong-ho-do.jpg'),
  ('dong-ho-da-nang', '/img/dm/dong-ho-da-nang.jpg'),
  ('cau-chi', '/img/dm/cau-chi.jpg'),
  ('cau-chi-ha-the', '/img/dm/cau-chi-ha-the.jpg'),
  ('de-cau-chi', '/img/dm/de-cau-chi.jpg'),
  ('bo-nguon-ups', '/img/dm/bo-nguon-ups.jpg'),
  ('bo-nguon', '/img/dm/bo-nguon.jpg'),
  ('ups', '/img/dm/ups.jpg'),
  ('phu-kien-tu-dien', '/img/dm/phu-kien-tu-dien.jpg'),
  ('cau-dau', '/img/dm/cau-dau.jpg'),
  ('den-bao-nut-nhan', '/img/dm/den-bao-nut-nhan.jpg'),
  ('motor-hop-giam-toc', '/img/dm/motor-hop-giam-toc.jpg'),
  ('dong-co-dien', '/img/dm/dong-co-dien.jpg'),
  ('motor-giam-toc', '/img/dm/motor-giam-toc.jpg')
) as v(slug, img)
where c.slug = v.slug and (c.image_url is null or c.image_url like '/demo/%' or c.image_url like '/img/dm/%');

-- Sample products: real photo instead of the drawing.
update public.products p set image_url = v.img from (values
  ('plc-siemens-s7-1200', '/img/sp/plc-siemens-s7-1200.jpg'),
  ('aptomat-schneider-easy9', '/img/sp/aptomat-schneider-easy9.jpg'),
  ('contactor-abb-af', '/img/sp/contactor-abb-af.jpg'),
  ('cam-bien-quang-sick', '/img/sp/cam-bien-quang-sick.jpg'),
  ('motor-giam-toc', '/img/sp/motor-giam-toc.jpg')
) as v(slug, img)
where p.slug = v.slug and (p.image_url is null or p.image_url like '/demo/%');

-- 113 new products with photos (price = "Liên hệ báo giá", stock = "Đặt hàng"). Existing slugs are skipped.
insert into public.products (slug, name, category_id, brand_id, summary, description, image_url, featured, published, in_stock) values
  ('plc-siemens-s7-200-smart', 'PLC Siemens S7-200 SMART', (select id from public.categories where slug = 'plc'), (select id from public.brands where slug = 'siemens'), 'Cung cấp pLC Siemens S7-200 SMART cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp pLC Siemens S7-200 SMART cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/plc-siemens-s7-200-smart.jpg', false, true, false),
  ('plc-siemens-s7-200', 'PLC Siemens S7-200', (select id from public.categories where slug = 'plc'), (select id from public.brands where slug = 'siemens'), 'Cung cấp pLC Siemens S7-200 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp pLC Siemens S7-200 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/plc-siemens-s7-200.jpg', false, true, false),
  ('plc-siemens-s7-300', 'PLC Siemens S7-300', (select id from public.categories where slug = 'plc'), (select id from public.brands where slug = 'siemens'), 'Cung cấp pLC Siemens S7-300 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp pLC Siemens S7-300 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/plc-siemens-s7-300.jpg', false, true, false),
  ('plc-siemens-s7-400', 'PLC Siemens S7-400', (select id from public.categories where slug = 'plc'), (select id from public.brands where slug = 'siemens'), 'Cung cấp pLC Siemens S7-400 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp pLC Siemens S7-400 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/plc-siemens-s7-400.jpg', false, true, false),
  ('plc-siemens-s7-1500', 'PLC Siemens S7-1500', (select id from public.categories where slug = 'plc'), (select id from public.brands where slug = 'siemens'), 'Cung cấp pLC Siemens S7-1500 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp pLC Siemens S7-1500 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/plc-siemens-s7-1500.jpg', true, true, false),
  ('bo-dieu-khien-siemens-logo', 'Bộ điều khiển logic Siemens LOGO!', (select id from public.categories where slug = 'plc'), (select id from public.brands where slug = 'siemens'), 'Cung cấp bộ điều khiển logic Siemens LOGO! cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ điều khiển logic Siemens LOGO! cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bo-dieu-khien-siemens-logo.jpg', false, true, false),
  ('module-mo-rong-plc-siemens', 'Module mở rộng I/O PLC Siemens', (select id from public.categories where slug = 'module-mo-rong'), (select id from public.brands where slug = 'siemens'), 'Cung cấp module mở rộng I/O PLC Siemens cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp module mở rộng I/O PLC Siemens cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/module-mo-rong-plc-siemens.jpg', false, true, false),
  ('dau-noi-profibus-siemens', 'Đầu nối PROFIBUS DP Siemens', (select id from public.categories where slug = 'module-mo-rong'), (select id from public.brands where slug = 'siemens'), 'Cung cấp đầu nối PROFIBUS DP Siemens cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp đầu nối PROFIBUS DP Siemens cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/dau-noi-profibus-siemens.jpg', false, true, false),
  ('hmi-siemens-tp-comfort', 'Màn hình HMI Siemens TP Comfort', (select id from public.categories where slug = 'hmi'), (select id from public.brands where slug = 'siemens'), 'Cung cấp màn hình HMI Siemens TP Comfort cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp màn hình HMI Siemens TP Comfort cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hmi-siemens-tp-comfort.jpg', false, true, false),
  ('hmi-siemens-kp-comfort', 'Màn hình HMI Siemens KP Comfort (bàn phím)', (select id from public.categories where slug = 'hmi'), (select id from public.brands where slug = 'siemens'), 'Cung cấp màn hình HMI Siemens KP Comfort (bàn phím) cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp màn hình HMI Siemens KP Comfort (bàn phím) cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hmi-siemens-kp-comfort.jpg', false, true, false),
  ('hmi-siemens-ktp-basic', 'Màn hình HMI Siemens KTP Basic', (select id from public.categories where slug = 'hmi'), (select id from public.brands where slug = 'siemens'), 'Cung cấp màn hình HMI Siemens KTP Basic cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp màn hình HMI Siemens KTP Basic cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hmi-siemens-ktp-basic.jpg', true, true, false),
  ('hmi-siemens-smart-700-ie', 'Màn hình HMI Siemens SMART 700 IE', (select id from public.categories where slug = 'hmi'), (select id from public.brands where slug = 'siemens'), 'Cung cấp màn hình HMI Siemens SMART 700 IE cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp màn hình HMI Siemens SMART 700 IE cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hmi-siemens-smart-700-ie.jpg', false, true, false),
  ('hmi-siemens-tp177b', 'Màn hình HMI Siemens TP 177B', (select id from public.categories where slug = 'hmi'), (select id from public.brands where slug = 'siemens'), 'Cung cấp màn hình HMI Siemens TP 177B cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp màn hình HMI Siemens TP 177B cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hmi-siemens-tp177b.jpg', false, true, false),
  ('hmi-siemens-op77a', 'Màn hình vận hành Siemens OP 77A', (select id from public.categories where slug = 'hmi'), (select id from public.brands where slug = 'siemens'), 'Cung cấp màn hình vận hành Siemens OP 77A cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp màn hình vận hành Siemens OP 77A cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hmi-siemens-op77a.jpg', false, true, false),
  ('nguon-siemens-sitop-psu100c', 'Bộ nguồn Siemens SITOP PSU100C', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'siemens'), 'Cung cấp bộ nguồn Siemens SITOP PSU100C cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ nguồn Siemens SITOP PSU100C cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nguon-siemens-sitop-psu100c.jpg', false, true, false),
  ('nguon-siemens-sitop-psu200m', 'Bộ nguồn Siemens SITOP PSU200M', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'siemens'), 'Cung cấp bộ nguồn Siemens SITOP PSU200M cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ nguồn Siemens SITOP PSU200M cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nguon-siemens-sitop-psu200m.jpg', false, true, false),
  ('module-bao-ve-siemens-sitop-pse200u', 'Module bảo vệ đầu ra Siemens SITOP PSE200U', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'siemens'), 'Cung cấp module bảo vệ đầu ra Siemens SITOP PSE200U cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp module bảo vệ đầu ra Siemens SITOP PSE200U cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/module-bao-ve-siemens-sitop-pse200u.jpg', false, true, false),
  ('nguon-siemens-logo-power', 'Bộ nguồn Siemens LOGO!Power', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'siemens'), 'Cung cấp bộ nguồn Siemens LOGO!Power cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ nguồn Siemens LOGO!Power cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nguon-siemens-logo-power.jpg', false, true, false),
  ('ups-dc-siemens-sitop', 'Bộ lưu điện DC Siemens SITOP UPS', (select id from public.categories where slug = 'ups'), (select id from public.brands where slug = 'siemens'), 'Cung cấp bộ lưu điện DC Siemens SITOP UPS cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ lưu điện DC Siemens SITOP UPS cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/ups-dc-siemens-sitop.jpg', false, true, false),
  ('bien-tan-siemens-v20', 'Biến tần Siemens SINAMICS V20', (select id from public.categories where slug = 'bien-tan'), (select id from public.brands where slug = 'siemens'), 'Cung cấp biến tần Siemens SINAMICS V20 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp biến tần Siemens SINAMICS V20 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bien-tan-siemens-v20.jpg', true, true, false),
  ('bien-tan-siemens-micromaster-420', 'Biến tần Siemens MICROMASTER 420', (select id from public.categories where slug = 'bien-tan'), (select id from public.brands where slug = 'siemens'), 'Cung cấp biến tần Siemens MICROMASTER 420 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp biến tần Siemens MICROMASTER 420 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bien-tan-siemens-micromaster-420.jpg', false, true, false),
  ('bien-tan-siemens-micromaster-440', 'Biến tần Siemens MICROMASTER 440', (select id from public.categories where slug = 'bien-tan'), (select id from public.brands where slug = 'siemens'), 'Cung cấp biến tần Siemens MICROMASTER 440 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp biến tần Siemens MICROMASTER 440 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bien-tan-siemens-micromaster-440.jpg', false, true, false),
  ('bien-tan-siemens-g120c', 'Biến tần Siemens SINAMICS G120C', (select id from public.categories where slug = 'bien-tan'), (select id from public.brands where slug = 'siemens'), 'Cung cấp biến tần Siemens SINAMICS G120C cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp biến tần Siemens SINAMICS G120C cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bien-tan-siemens-g120c.jpg', false, true, false),
  ('bien-tan-siemens-g120', 'Biến tần Siemens SINAMICS G120', (select id from public.categories where slug = 'bien-tan'), (select id from public.brands where slug = 'siemens'), 'Cung cấp biến tần Siemens SINAMICS G120 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp biến tần Siemens SINAMICS G120 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bien-tan-siemens-g120.jpg', false, true, false),
  ('control-unit-siemens-g120', 'Control Unit biến tần Siemens SINAMICS G120', (select id from public.categories where slug = 'phu-kien-bien-tan'), (select id from public.brands where slug = 'siemens'), 'Cung cấp control Unit biến tần Siemens SINAMICS G120 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp control Unit biến tần Siemens SINAMICS G120 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/control-unit-siemens-g120.jpg', false, true, false),
  ('khoi-dong-mem-siemens-3rw', 'Khởi động mềm Siemens SIRIUS 3RW', (select id from public.categories where slug = 'khoi-dong-mem'), (select id from public.brands where slug = 'siemens'), 'Cung cấp khởi động mềm Siemens SIRIUS 3RW cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp khởi động mềm Siemens SIRIUS 3RW cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/khoi-dong-mem-siemens-3rw.jpg', false, true, false),
  ('mcb-siemens-5sl', 'Aptomat MCB Siemens 5SL', (select id from public.categories where slug = 'mcb'), (select id from public.brands where slug = 'siemens'), 'Cung cấp aptomat MCB Siemens 5SL cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp aptomat MCB Siemens 5SL cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/mcb-siemens-5sl.jpg', false, true, false),
  ('mccb-siemens-3va', 'Aptomat khối MCCB Siemens 3VA', (select id from public.categories where slug = 'mccb'), (select id from public.brands where slug = 'siemens'), 'Cung cấp aptomat khối MCCB Siemens 3VA cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp aptomat khối MCCB Siemens 3VA cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/mccb-siemens-3va.jpg', false, true, false),
  ('contactor-siemens-3rt', 'Contactor Siemens SIRIUS 3RT', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'siemens'), 'Cung cấp contactor Siemens SIRIUS 3RT cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor Siemens SIRIUS 3RT cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-siemens-3rt.jpg', false, true, false),
  ('contactor-siemens-3ts', 'Contactor Siemens 3TS', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'siemens'), 'Cung cấp contactor Siemens 3TS cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor Siemens 3TS cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-siemens-3ts.jpg', false, true, false),
  ('bo-khoi-dong-tu-siemens-3rt2', 'Bộ khởi động từ Siemens SIRIUS 3RT2', (select id from public.categories where slug = 'khoi-dong-tu'), (select id from public.brands where slug = 'siemens'), 'Cung cấp bộ khởi động từ Siemens SIRIUS 3RT2 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ khởi động từ Siemens SIRIUS 3RT2 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bo-khoi-dong-tu-siemens-3rt2.jpg', false, true, false),
  ('cb-bao-ve-dong-co-siemens-3rv', 'CB bảo vệ động cơ Siemens SIRIUS 3RV', (select id from public.categories where slug = 'khoi-dong-tu'), (select id from public.brands where slug = 'siemens'), 'Cung cấp cB bảo vệ động cơ Siemens SIRIUS 3RV cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cB bảo vệ động cơ Siemens SIRIUS 3RV cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cb-bao-ve-dong-co-siemens-3rv.jpg', false, true, false),
  ('contactor-phu-siemens-3th', 'Contactor phụ (relay điều khiển) Siemens 3TH', (select id from public.categories where slug = 'relay-trung-gian'), (select id from public.brands where slug = 'siemens'), 'Cung cấp contactor phụ (relay điều khiển) Siemens 3TH cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor phụ (relay điều khiển) Siemens 3TH cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-phu-siemens-3th.jpg', false, true, false),
  ('ro-le-nhiet-siemens-3ru', 'Rơ le nhiệt Siemens SIRIUS 3RU', (select id from public.categories where slug = 'ro-le-nhiet'), (select id from public.brands where slug = 'siemens'), 'Cung cấp rơ le nhiệt Siemens SIRIUS 3RU cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp rơ le nhiệt Siemens SIRIUS 3RU cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/ro-le-nhiet-siemens-3ru.jpg', false, true, false),
  ('ro-le-nhiet-dien-tu-siemens-3rb', 'Rơ le nhiệt điện tử Siemens SIRIUS 3RB', (select id from public.categories where slug = 'ro-le-nhiet'), (select id from public.brands where slug = 'siemens'), 'Cung cấp rơ le nhiệt điện tử Siemens SIRIUS 3RB cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp rơ le nhiệt điện tử Siemens SIRIUS 3RB cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/ro-le-nhiet-dien-tu-siemens-3rb.jpg', false, true, false),
  ('timer-siemens-3rp', 'Timer Siemens SIRIUS 3RP', (select id from public.categories where slug = 'timer'), (select id from public.brands where slug = 'siemens'), 'Cung cấp timer Siemens SIRIUS 3RP cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp timer Siemens SIRIUS 3RP cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/timer-siemens-3rp.jpg', false, true, false),
  ('servo-siemens-v90', 'Bộ servo Siemens SINAMICS V90 và động cơ 1FL6', (select id from public.categories where slug = 'servo'), (select id from public.brands where slug = 'siemens'), 'Cung cấp bộ servo Siemens SINAMICS V90 và động cơ 1FL6 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ servo Siemens SINAMICS V90 và động cơ 1FL6 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/servo-siemens-v90.jpg', false, true, false),
  ('dong-co-dien-siemens-simotics', 'Động cơ điện 3 pha Siemens SIMOTICS', (select id from public.categories where slug = 'dong-co-dien'), (select id from public.brands where slug = 'siemens'), 'Cung cấp động cơ điện 3 pha Siemens SIMOTICS cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp động cơ điện 3 pha Siemens SIMOTICS cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/dong-co-dien-siemens-simotics.jpg', false, true, false),
  ('cam-bien-muc-radar-siemens', 'Cảm biến đo mức radar Siemens SITRANS LR', (select id from public.categories where slug = 'cam-bien-dieu-khien-nhiet'), (select id from public.brands where slug = 'siemens'), 'Cung cấp cảm biến đo mức radar Siemens SITRANS LR cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến đo mức radar Siemens SITRANS LR cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-muc-radar-siemens.jpg', false, true, false),
  ('cam-bien-ap-suat-siemens-sitrans-p', 'Cảm biến áp suất Siemens SITRANS P', (select id from public.categories where slug = 'cam-bien-dieu-khien-nhiet'), (select id from public.brands where slug = 'siemens'), 'Cung cấp cảm biến áp suất Siemens SITRANS P cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến áp suất Siemens SITRANS P cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-ap-suat-siemens-sitrans-p.jpg', false, true, false),
  ('cau-chi-siemens-3nw', 'Cầu chì ống Siemens 3NW', (select id from public.categories where slug = 'cau-chi-ha-the'), (select id from public.brands where slug = 'siemens'), 'Cung cấp cầu chì ống Siemens 3NW cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu chì ống Siemens 3NW cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-chi-siemens-3nw.jpg', false, true, false),
  ('cau-chi-ban-dan-siemens-sitor', 'Cầu chì bán dẫn Siemens SITOR 3NE', (select id from public.categories where slug = 'cau-chi-ha-the'), (select id from public.brands where slug = 'siemens'), 'Cung cấp cầu chì bán dẫn Siemens SITOR 3NE cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu chì bán dẫn Siemens SITOR 3NE cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-chi-ban-dan-siemens-sitor.jpg', false, true, false),
  ('mccb-schneider-easypact-ezc', 'Aptomat khối MCCB Schneider EasyPact EZC', (select id from public.categories where slug = 'mccb'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp aptomat khối MCCB Schneider EasyPact EZC cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp aptomat khối MCCB Schneider EasyPact EZC cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/mccb-schneider-easypact-ezc.jpg', false, true, false),
  ('contactor-schneider-easypact-tvs', 'Contactor Schneider EasyPact TVS LC1E', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp contactor Schneider EasyPact TVS LC1E cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor Schneider EasyPact TVS LC1E cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-schneider-easypact-tvs.jpg', false, true, false),
  ('contactor-schneider-tesys-d', 'Contactor Schneider TeSys D LC1D', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp contactor Schneider TeSys D LC1D cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor Schneider TeSys D LC1D cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-schneider-tesys-d.jpg', true, true, false),
  ('contactor-schneider-tesys-f', 'Contactor Schneider TeSys F LC1F', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp contactor Schneider TeSys F LC1F cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor Schneider TeSys F LC1F cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-schneider-tesys-f.jpg', false, true, false),
  ('cb-bao-ve-dong-co-schneider-gv2', 'CB bảo vệ động cơ Schneider TeSys GV2', (select id from public.categories where slug = 'khoi-dong-tu'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp cB bảo vệ động cơ Schneider TeSys GV2 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cB bảo vệ động cơ Schneider TeSys GV2 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cb-bao-ve-dong-co-schneider-gv2.jpg', false, true, false),
  ('ro-le-nhiet-schneider-lrd', 'Rơ le nhiệt Schneider TeSys LRD', (select id from public.categories where slug = 'ro-le-nhiet'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp rơ le nhiệt Schneider TeSys LRD cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp rơ le nhiệt Schneider TeSys LRD cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/ro-le-nhiet-schneider-lrd.jpg', false, true, false),
  ('relay-trung-gian-schneider-rxm', 'Relay trung gian Schneider Zelio RXM', (select id from public.categories where slug = 'relay-trung-gian'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp relay trung gian Schneider Zelio RXM cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay trung gian Schneider Zelio RXM cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-trung-gian-schneider-rxm.jpg', false, true, false),
  ('timer-schneider-zelio-re22', 'Timer Schneider Zelio RE22', (select id from public.categories where slug = 'timer'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp timer Schneider Zelio RE22 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp timer Schneider Zelio RE22 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/timer-schneider-zelio-re22.jpg', false, true, false),
  ('relay-bao-ve-pha-schneider', 'Relay bảo vệ pha Schneider', (select id from public.categories where slug = 'relay-bao-ve'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp relay bảo vệ pha Schneider cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay bảo vệ pha Schneider cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-bao-ve-pha-schneider.jpg', false, true, false),
  ('dong-ho-da-nang-schneider-pm', 'Đồng hồ đo đa năng Schneider PowerLogic PM', (select id from public.categories where slug = 'dong-ho-da-nang'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp đồng hồ đo đa năng Schneider PowerLogic PM cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp đồng hồ đo đa năng Schneider PowerLogic PM cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/dong-ho-da-nang-schneider-pm.jpg', false, true, false),
  ('cam-bien-quang-telemecanique-xuk', 'Cảm biến quang Schneider Telemecanique XUK', (select id from public.categories where slug = 'cam-bien-quang'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp cảm biến quang Schneider Telemecanique XUK cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến quang Schneider Telemecanique XUK cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-quang-telemecanique-xuk.jpg', false, true, false),
  ('cam-bien-sieu-am-telemecanique', 'Cảm biến siêu âm Schneider Telemecanique XX', (select id from public.categories where slug = 'cam-bien-dieu-khien-nhiet'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp cảm biến siêu âm Schneider Telemecanique XX cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến siêu âm Schneider Telemecanique XX cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-sieu-am-telemecanique.jpg', false, true, false),
  ('hop-nut-dung-khan-cap-schneider', 'Hộp nút dừng khẩn cấp Schneider Harmony XAP', (select id from public.categories where slug = 'den-bao-nut-nhan'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp hộp nút dừng khẩn cấp Schneider Harmony XAP cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp hộp nút dừng khẩn cấp Schneider Harmony XAP cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hop-nut-dung-khan-cap-schneider.jpg', false, true, false),
  ('nut-nhan-schneider-harmony-xb4', 'Nút nhấn Schneider Harmony XB4', (select id from public.categories where slug = 'den-bao-nut-nhan'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp nút nhấn Schneider Harmony XB4 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp nút nhấn Schneider Harmony XB4 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nut-nhan-schneider-harmony-xb4.jpg', false, true, false),
  ('nut-nhan-doi-schneider-harmony', 'Nút nhấn đôi ON/OFF Schneider Harmony', (select id from public.categories where slug = 'den-bao-nut-nhan'), (select id from public.brands where slug = 'schneider-electric'), 'Cung cấp nút nhấn đôi ON/OFF Schneider Harmony cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp nút nhấn đôi ON/OFF Schneider Harmony cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nut-nhan-doi-schneider-harmony.jpg', false, true, false),
  ('contactor-abb-ax', 'Contactor ABB AX', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'abb'), 'Cung cấp contactor ABB AX cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor ABB AX cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-abb-ax.jpg', false, true, false),
  ('mcb-abb-s200', 'Aptomat MCB ABB S200', (select id from public.categories where slug = 'mcb'), (select id from public.brands where slug = 'abb'), 'Cung cấp aptomat MCB ABB S200 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp aptomat MCB ABB S200 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/mcb-abb-s200.jpg', true, true, false),
  ('mccb-abb-tmax', 'Aptomat khối MCCB ABB Tmax', (select id from public.categories where slug = 'mccb'), (select id from public.brands where slug = 'abb'), 'Cung cấp aptomat khối MCCB ABB Tmax cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp aptomat khối MCCB ABB Tmax cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/mccb-abb-tmax.jpg', false, true, false),
  ('bien-tan-abb-acs', 'Biến tần ABB ACS', (select id from public.categories where slug = 'bien-tan'), (select id from public.brands where slug = 'abb'), 'Cung cấp biến tần ABB ACS cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp biến tần ABB ACS cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bien-tan-abb-acs.jpg', false, true, false),
  ('ro-le-nhiet-abb-ta', 'Rơ le nhiệt ABB TA', (select id from public.categories where slug = 'ro-le-nhiet'), (select id from public.brands where slug = 'abb'), 'Cung cấp rơ le nhiệt ABB TA cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp rơ le nhiệt ABB TA cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/ro-le-nhiet-abb-ta.jpg', false, true, false),
  ('relay-giam-sat-abb-cm', 'Relay giám sát ABB CM', (select id from public.categories where slug = 'relay-bao-ve'), (select id from public.brands where slug = 'abb'), 'Cung cấp relay giám sát ABB CM cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay giám sát ABB CM cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-giam-sat-abb-cm.jpg', false, true, false),
  ('relay-trung-gian-abb-cr', 'Relay trung gian ABB CR', (select id from public.categories where slug = 'relay-trung-gian'), (select id from public.brands where slug = 'abb'), 'Cung cấp relay trung gian ABB CR cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay trung gian ABB CR cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-trung-gian-abb-cr.jpg', false, true, false),
  ('cau-chi-nh-abb', 'Cầu chì NH ABB', (select id from public.categories where slug = 'cau-chi-ha-the'), (select id from public.brands where slug = 'abb'), 'Cung cấp cầu chì NH ABB cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu chì NH ABB cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-chi-nh-abb.jpg', false, true, false),
  ('contactor-chint-nxc', 'Contactor CHINT NXC', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'chint'), 'Cung cấp contactor CHINT NXC cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor CHINT NXC cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-chint-nxc.jpg', false, true, false),
  ('contactor-chint-cjx2', 'Contactor CHINT CJX2', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'chint'), 'Cung cấp contactor CHINT CJX2 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor CHINT CJX2 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-chint-cjx2.jpg', false, true, false),
  ('contactor-chint-nc2', 'Contactor CHINT NC2', (select id from public.categories where slug = 'contactor'), (select id from public.brands where slug = 'chint'), 'Cung cấp contactor CHINT NC2 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp contactor CHINT NC2 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/contactor-chint-nc2.jpg', false, true, false),
  ('relay-bao-ve-pha-chint-xj3', 'Relay bảo vệ pha CHINT XJ3', (select id from public.categories where slug = 'relay-bao-ve'), (select id from public.brands where slug = 'chint'), 'Cung cấp relay bảo vệ pha CHINT XJ3 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay bảo vệ pha CHINT XJ3 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-bao-ve-pha-chint-xj3.jpg', false, true, false),
  ('cb-bao-ve-dong-co-chint-ns2', 'CB bảo vệ động cơ CHINT NS2', (select id from public.categories where slug = 'khoi-dong-tu'), (select id from public.brands where slug = 'chint'), 'Cung cấp cB bảo vệ động cơ CHINT NS2 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cB bảo vệ động cơ CHINT NS2 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cb-bao-ve-dong-co-chint-ns2.jpg', false, true, false),
  ('nguon-weidmuller-pro-eco', 'Bộ nguồn Weidmüller PRO eco', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'weidmuller'), 'Cung cấp bộ nguồn Weidmüller PRO eco cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ nguồn Weidmüller PRO eco cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nguon-weidmuller-pro-eco.jpg', true, true, false),
  ('nguon-weidmuller-pro-top', 'Bộ nguồn Weidmüller PRO top', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'weidmuller'), 'Cung cấp bộ nguồn Weidmüller PRO top cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ nguồn Weidmüller PRO top cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nguon-weidmuller-pro-top.jpg', false, true, false),
  ('switch-ethernet-weidmuller', 'Switch Ethernet công nghiệp Weidmüller', (select id from public.categories where slug = 'module-mo-rong'), (select id from public.brands where slug = 'weidmuller'), 'Cung cấp switch Ethernet công nghiệp Weidmüller cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp switch Ethernet công nghiệp Weidmüller cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/switch-ethernet-weidmuller.jpg', false, true, false),
  ('cau-dau-weidmuller', 'Cầu đấu dây Weidmüller', (select id from public.categories where slug = 'cau-dau'), (select id from public.brands where slug = 'weidmuller'), 'Cung cấp cầu đấu dây Weidmüller cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu đấu dây Weidmüller cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-dau-weidmuller.jpg', false, true, false),
  ('relay-kem-de-weidmuller', 'Relay kèm đế Weidmüller', (select id from public.categories where slug = 'relay-trung-gian'), (select id from public.brands where slug = 'weidmuller'), 'Cung cấp relay kèm đế Weidmüller cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay kèm đế Weidmüller cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-kem-de-weidmuller.jpg', false, true, false),
  ('nguon-phoenix-contact', 'Bộ nguồn Phoenix Contact', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'phoenix-contact'), 'Cung cấp bộ nguồn Phoenix Contact cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ nguồn Phoenix Contact cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nguon-phoenix-contact.jpg', false, true, false),
  ('switch-ethernet-phoenix-contact', 'Switch Ethernet công nghiệp Phoenix Contact', (select id from public.categories where slug = 'module-mo-rong'), (select id from public.brands where slug = 'phoenix-contact'), 'Cung cấp switch Ethernet công nghiệp Phoenix Contact cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp switch Ethernet công nghiệp Phoenix Contact cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/switch-ethernet-phoenix-contact.jpg', false, true, false),
  ('cau-dau-phoenix-contact', 'Cầu đấu dây Phoenix Contact', (select id from public.categories where slug = 'cau-dau'), (select id from public.brands where slug = 'phoenix-contact'), 'Cung cấp cầu đấu dây Phoenix Contact cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu đấu dây Phoenix Contact cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-dau-phoenix-contact.jpg', false, true, false),
  ('cau-dau-cam-phoenix-contact', 'Cầu đấu dạng cắm Phoenix Contact', (select id from public.categories where slug = 'cau-dau'), (select id from public.brands where slug = 'phoenix-contact'), 'Cung cấp cầu đấu dạng cắm Phoenix Contact cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu đấu dạng cắm Phoenix Contact cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-dau-cam-phoenix-contact.jpg', false, true, false),
  ('cam-bien-tiem-can-ifm-m30', 'Cảm biến tiệm cận ifm M30', (select id from public.categories where slug = 'cam-bien-tiem-can'), (select id from public.brands where slug = 'ifm'), 'Cung cấp cảm biến tiệm cận ifm M30 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến tiệm cận ifm M30 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-tiem-can-ifm-m30.jpg', false, true, false),
  ('cam-bien-tiem-can-ifm-m12', 'Cảm biến tiệm cận ifm M12', (select id from public.categories where slug = 'cam-bien-tiem-can'), (select id from public.brands where slug = 'ifm'), 'Cung cấp cảm biến tiệm cận ifm M12 cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến tiệm cận ifm M12 cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-tiem-can-ifm-m12.jpg', true, true, false),
  ('cam-bien-dien-dung-ifm', 'Cảm biến điện dung ifm', (select id from public.categories where slug = 'cam-bien-tiem-can'), (select id from public.brands where slug = 'ifm'), 'Cung cấp cảm biến điện dung ifm cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến điện dung ifm cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-dien-dung-ifm.jpg', false, true, false),
  ('cam-bien-nhiet-do-ifm', 'Cảm biến nhiệt độ ifm', (select id from public.categories where slug = 'can-nhiet'), (select id from public.brands where slug = 'ifm'), 'Cung cấp cảm biến nhiệt độ ifm cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến nhiệt độ ifm cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-nhiet-do-ifm.jpg', false, true, false),
  ('cam-bien-luu-luong-ifm', 'Cảm biến lưu lượng ifm', (select id from public.categories where slug = 'cam-bien-dieu-khien-nhiet'), (select id from public.brands where slug = 'ifm'), 'Cung cấp cảm biến lưu lượng ifm cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến lưu lượng ifm cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-luu-luong-ifm.jpg', false, true, false),
  ('cam-bien-quang-ifm', 'Cảm biến quang ifm', (select id from public.categories where slug = 'cam-bien-quang'), (select id from public.brands where slug = 'ifm'), 'Cung cấp cảm biến quang ifm cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến quang ifm cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-quang-ifm.jpg', false, true, false),
  ('cam-bien-tiem-can-pepperl-fuchs-tru', 'Cảm biến tiệm cận Pepperl+Fuchs dạng trụ', (select id from public.categories where slug = 'cam-bien-tiem-can'), (select id from public.brands where slug = 'pepperl-fuchs'), 'Cung cấp cảm biến tiệm cận Pepperl+Fuchs dạng trụ cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến tiệm cận Pepperl+Fuchs dạng trụ cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-tiem-can-pepperl-fuchs-tru.jpg', false, true, false),
  ('cam-bien-tiem-can-pepperl-fuchs-vuong', 'Cảm biến tiệm cận Pepperl+Fuchs dạng hộp', (select id from public.categories where slug = 'cam-bien-tiem-can'), (select id from public.brands where slug = 'pepperl-fuchs'), 'Cung cấp cảm biến tiệm cận Pepperl+Fuchs dạng hộp cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến tiệm cận Pepperl+Fuchs dạng hộp cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-tiem-can-pepperl-fuchs-vuong.jpg', false, true, false),
  ('cam-bien-quang-pepperl-fuchs', 'Cảm biến quang Pepperl+Fuchs', (select id from public.categories where slug = 'cam-bien-quang'), (select id from public.brands where slug = 'pepperl-fuchs'), 'Cung cấp cảm biến quang Pepperl+Fuchs cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến quang Pepperl+Fuchs cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-quang-pepperl-fuchs.jpg', false, true, false),
  ('cam-bien-mau-sick', 'Cảm biến màu SICK', (select id from public.categories where slug = 'cam-bien-quang'), (select id from public.brands where slug = 'sick'), 'Cung cấp cảm biến màu SICK cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến màu SICK cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-mau-sick.jpg', false, true, false),
  ('cam-bien-nhan-sick', 'Cảm biến nhãn dạng chữ U SICK', (select id from public.categories where slug = 'cam-bien-quang'), (select id from public.brands where slug = 'sick'), 'Cung cấp cảm biến nhãn dạng chữ U SICK cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến nhãn dạng chữ U SICK cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-nhan-sick.jpg', false, true, false),
  ('cam-bien-ap-suat-sick-pbs', 'Cảm biến áp suất SICK PBS', (select id from public.categories where slug = 'cam-bien-dieu-khien-nhiet'), (select id from public.brands where slug = 'sick'), 'Cung cấp cảm biến áp suất SICK PBS cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến áp suất SICK PBS cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-ap-suat-sick-pbs.jpg', false, true, false),
  ('relay-an-toan-pilz-pnoz', 'Relay an toàn Pilz PNOZ', (select id from public.categories where slug = 'relay-bao-ve'), (select id from public.brands where slug = 'pilz'), 'Cung cấp relay an toàn Pilz PNOZ cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay an toàn Pilz PNOZ cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-an-toan-pilz-pnoz.jpg', false, true, false),
  ('cong-tac-an-toan-pilz-psen', 'Công tắc an toàn Pilz PSEN', (select id from public.categories where slug = 'cam-bien-dieu-khien-nhiet'), (select id from public.brands where slug = 'pilz'), 'Cung cấp công tắc an toàn Pilz PSEN cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp công tắc an toàn Pilz PSEN cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cong-tac-an-toan-pilz-psen.jpg', false, true, false),
  ('cam-bien-tiem-can-autonics-pr', 'Cảm biến tiệm cận Autonics PR', (select id from public.categories where slug = 'cam-bien-tiem-can'), (select id from public.brands where slug = 'autonics'), 'Cung cấp cảm biến tiệm cận Autonics PR cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến tiệm cận Autonics PR cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-tiem-can-autonics-pr.jpg', false, true, false),
  ('cam-bien-tiem-can-autonics-ps', 'Cảm biến tiệm cận Autonics PS dạng hộp', (select id from public.categories where slug = 'cam-bien-tiem-can'), (select id from public.brands where slug = 'autonics'), 'Cung cấp cảm biến tiệm cận Autonics PS dạng hộp cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến tiệm cận Autonics PS dạng hộp cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-tiem-can-autonics-ps.jpg', false, true, false),
  ('cam-bien-quang-autonics-br', 'Cảm biến quang Autonics BR', (select id from public.categories where slug = 'cam-bien-quang'), (select id from public.brands where slug = 'autonics'), 'Cung cấp cảm biến quang Autonics BR cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến quang Autonics BR cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-quang-autonics-br.jpg', false, true, false),
  ('cam-bien-quang-autonics-bj', 'Cảm biến quang Autonics BJ', (select id from public.categories where slug = 'cam-bien-quang'), (select id from public.brands where slug = 'autonics'), 'Cung cấp cảm biến quang Autonics BJ cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cảm biến quang Autonics BJ cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cam-bien-quang-autonics-bj.jpg', false, true, false),
  ('nguon-autonics-spb', 'Bộ nguồn Autonics SPB', (select id from public.categories where slug = 'bo-nguon'), (select id from public.brands where slug = 'autonics'), 'Cung cấp bộ nguồn Autonics SPB cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ nguồn Autonics SPB cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/nguon-autonics-spb.jpg', false, true, false),
  ('encoder-autonics-e50s', 'Encoder Autonics E50S', (select id from public.categories where slug = 'encoder'), (select id from public.brands where slug = 'autonics'), 'Cung cấp encoder Autonics E50S cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp encoder Autonics E50S cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/encoder-autonics-e50s.jpg', true, true, false),
  ('bo-dieu-khien-tu-bu-mikro', 'Bộ điều khiển tụ bù Mikro PFR', (select id from public.categories where slug = 'bo-dieu-khien-tu-bu'), (select id from public.brands where slug = 'mikro'), 'Cung cấp bộ điều khiển tụ bù Mikro PFR cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp bộ điều khiển tụ bù Mikro PFR cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/bo-dieu-khien-tu-bu-mikro.jpg', false, true, false),
  ('relay-bao-ve-mikro', 'Relay bảo vệ dòng rò Mikro', (select id from public.categories where slug = 'relay-bao-ve'), (select id from public.brands where slug = 'mikro'), 'Cung cấp relay bảo vệ dòng rò Mikro cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp relay bảo vệ dòng rò Mikro cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/relay-bao-ve-mikro.jpg', false, true, false),
  ('cau-chi-nh-eaton-bussmann', 'Cầu chì NH Eaton Bussmann', (select id from public.categories where slug = 'cau-chi-ha-the'), (select id from public.brands where slug = 'eaton'), 'Cung cấp cầu chì NH Eaton Bussmann cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu chì NH Eaton Bussmann cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-chi-nh-eaton-bussmann.jpg', false, true, false),
  ('cau-chi-ban-dan-eaton-bussmann', 'Cầu chì bán dẫn Eaton Bussmann', (select id from public.categories where slug = 'cau-chi-ha-the'), (select id from public.brands where slug = 'eaton'), 'Cung cấp cầu chì bán dẫn Eaton Bussmann cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu chì bán dẫn Eaton Bussmann cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-chi-ban-dan-eaton-bussmann.jpg', false, true, false),
  ('cau-chi-ong-10x38-bussmann', 'Cầu chì ống 10x38 Eaton Bussmann', (select id from public.categories where slug = 'cau-chi-ha-the'), (select id from public.brands where slug = 'eaton'), 'Cung cấp cầu chì ống 10x38 Eaton Bussmann cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cầu chì ống 10x38 Eaton Bussmann cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cau-chi-ong-10x38-bussmann.jpg', false, true, false),
  ('de-cau-chi-gan-ray', 'Đế cầu chì gắn ray', (select id from public.categories where slug = 'de-cau-chi'), null, 'Cung cấp đế cầu chì gắn ray cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp đế cầu chì gắn ray cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/de-cau-chi-gan-ray.jpg', false, true, false),
  ('tu-bu-ha-the', 'Tụ bù hạ thế', (select id from public.categories where slug = 'tu-bu'), null, 'Cung cấp tụ bù hạ thế cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp tụ bù hạ thế cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/tu-bu-ha-the.jpg', false, true, false),
  ('cuon-khang-loc-song-hai', 'Cuộn kháng lọc sóng hài', (select id from public.categories where slug = 'cuon-khang'), null, 'Cung cấp cuộn kháng lọc sóng hài cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp cuộn kháng lọc sóng hài cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cuon-khang-loc-song-hai.jpg', false, true, false),
  ('encoder-cong-nghiep', 'Encoder công nghiệp (tương đối, tuyệt đối)', (select id from public.categories where slug = 'encoder'), null, 'Cung cấp encoder công nghiệp (tương đối, tuyệt đối) cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp encoder công nghiệp (tương đối, tuyệt đối) cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/encoder-cong-nghiep.jpg', false, true, false),
  ('den-bao-pha-ad16', 'Đèn báo pha AD16 (đỏ, vàng, xanh)', (select id from public.categories where slug = 'den-bao-nut-nhan'), null, 'Cung cấp đèn báo pha AD16 (đỏ, vàng, xanh) cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp đèn báo pha AD16 (đỏ, vàng, xanh) cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/den-bao-pha-ad16.jpg', false, true, false),
  ('den-thap-tin-hieu', 'Đèn tháp tín hiệu nhiều tầng', (select id from public.categories where slug = 'den-bao-nut-nhan'), null, 'Cung cấp đèn tháp tín hiệu nhiều tầng cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp đèn tháp tín hiệu nhiều tầng cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/den-thap-tin-hieu.jpg', false, true, false),
  ('cong-tac-xoay', 'Công tắc xoay 2–3 vị trí', (select id from public.categories where slug = 'den-bao-nut-nhan'), null, 'Cung cấp công tắc xoay 2–3 vị trí cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp công tắc xoay 2–3 vị trí cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cong-tac-xoay.jpg', false, true, false),
  ('cong-tac-chia-khoa', 'Công tắc chìa khóa', (select id from public.categories where slug = 'den-bao-nut-nhan'), null, 'Cung cấp công tắc chìa khóa cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp công tắc chìa khóa cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/cong-tac-chia-khoa.jpg', false, true, false),
  ('hop-nut-nhan-cau-truc', 'Hộp nút nhấn điều khiển cầu trục', (select id from public.categories where slug = 'den-bao-nut-nhan'), null, 'Cung cấp hộp nút nhấn điều khiển cầu trục cho nhà máy và tủ điện công nghiệp. Tư vấn chọn mã đúng thông số, báo giá nhanh.', 'Đạt Danh cung cấp hộp nút nhấn điều khiển cầu trục cho nhà máy, xưởng sản xuất và tủ điện công nghiệp.

Gửi mã hàng (model) hoặc ảnh tem nhãn thiết bị đang dùng để được kiểm tra mã tương đương, thời gian giao hàng và báo giá.

Hình ảnh mang tính minh họa; thông số chi tiết theo từng mã cụ thể.', '/img/sp/hop-nut-nhan-cau-truc.jpg', false, true, false)
on conflict (slug) do nothing;

-- Home slider: photo collages instead of drawings (only slides still showing the drawings).
update public.banners set collage = array['/img/banner/bien-tan.jpg', '/img/banner/dong-cat.jpg', '/img/banner/cam-bien.jpg']::text[]
where title = 'Vật tư & thiết bị cho nhà máy của bạn' and (collage is null or collage = '{}' or collage[1] like '/demo/%');
update public.banners set collage = array['/img/banner/plc.jpg', '/img/banner/hmi.jpg', '/img/banner/cam-bien-quang.jpg']::text[]
where title = 'Thiết bị tự động hóa từ các hãng uy tín' and (collage is null or collage = '{}' or collage[1] like '/demo/%');
update public.banners set title = 'Thiết bị đóng cắt, nguồn & phụ kiện tủ điện', subtitle = 'Aptomat, contactor, bộ nguồn, cầu đấu và phụ kiện từ ABB, Schneider, Siemens, Weidmüller, Phoenix Contact… Báo giá nhanh theo danh sách vật tư của nhà máy.', collage = array['/img/banner/mccb.jpg', '/img/banner/nguon.jpg', '/img/banner/cau-dau.jpg']::text[], cta_label = 'Xem thiết bị đóng cắt', cta_url = '/danh-muc-san-pham/thiet-bi-dong-cat'
where title = 'Khí nén – thủy lực, van & phụ kiện đường ống' and (collage is null or collage[1] like '/demo/%')
  and not exists (select 1 from public.banners where title = 'Thiết bị đóng cắt, nguồn & phụ kiện tủ điện');
