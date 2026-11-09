# Draft: brand → product lines; each line lists the current product slugs it absorbs.
# (brand slug | "" for unbranded, line name, product group slug for cross-filter, series text, [product slugs], image slug)
LINES = [
 ("siemens","PLC, LOGO!","tu-dong-hoa","S7-200 · S7-200 SMART · S7-300 · S7-400 · S7-1200 · S7-1500 · ET200 · LOGO! · module mở rộng I/O · PROFIBUS",
  ["plc-siemens-s7-1200","plc-siemens-s7-1500","plc-siemens-s7-200","plc-siemens-s7-200-smart","plc-siemens-s7-300","plc-siemens-s7-400","bo-dieu-khien-siemens-logo","module-mo-rong-plc-siemens","dau-noi-profibus-siemens"],"plc-siemens-s7-1200"),
 ("siemens","HMI – Màn hình vận hành","tu-dong-hoa","KTP Basic · TP/KP Comfort · SMART 700 IE · TP 177B · OP 77A",
  ["hmi-siemens-ktp-basic","hmi-siemens-tp-comfort","hmi-siemens-kp-comfort","hmi-siemens-smart-700-ie","hmi-siemens-tp177b","hmi-siemens-op77a"],"hmi-siemens-ktp-basic"),
 ("siemens","Biến tần – Khởi động mềm","bien-tan-khoi-dong-mem","SINAMICS V20 · G120C · G120 (Control Unit, Power Module) · MICROMASTER 420/440 · SIRIUS 3RW",
  ["bien-tan-siemens-v20","bien-tan-siemens-g120c","bien-tan-siemens-g120","control-unit-siemens-g120","bien-tan-siemens-micromaster-420","bien-tan-siemens-micromaster-440","khoi-dong-mem-siemens-3rw"],"bien-tan-siemens-v20"),
 ("siemens","Motor – Servo","motor-hop-giam-toc","Động cơ SIMOTICS · Servo SINAMICS V90 + động cơ 1FL6",
  ["dong-co-dien-siemens-simotics","servo-siemens-v90"],"dong-co-dien-siemens-simotics"),
 ("siemens","MCB, MCCB","thiet-bi-dong-cat","MCB 5SL · MCCB 3VA",["mcb-siemens-5sl","mccb-siemens-3va"],"mccb-siemens-3va"),
 ("siemens","Contactor – Khởi động từ – Rơ le nhiệt","contactor-khoi-dong-tu","SIRIUS 3RT · 3RT2 · 3TS · CB động cơ 3RV · Rơ le nhiệt 3RU / 3RB · Contactor phụ 3TH · Timer 3RP",
  ["contactor-siemens-3rt","bo-khoi-dong-tu-siemens-3rt2","contactor-siemens-3ts","cb-bao-ve-dong-co-siemens-3rv","ro-le-nhiet-siemens-3ru","ro-le-nhiet-dien-tu-siemens-3rb","contactor-phu-siemens-3th","timer-siemens-3rp"],"contactor-siemens-3rt"),
 ("siemens","Nút nhấn, đèn báo","phu-kien-tu-dien","SIRIUS ACT 3SU1 (nút nhấn, đèn báo, công tắc xoay, dừng khẩn)",[],"nut-nhan-schneider-harmony-xb4"),
 ("siemens","Bộ nguồn SITOP – UPS","bo-nguon-ups","SITOP PSU100C · PSU200M · PSE200U · DC UPS · LOGO!Power",
  ["nguon-siemens-sitop-psu100c","nguon-siemens-sitop-psu200m","module-bao-ve-siemens-sitop-pse200u","ups-dc-siemens-sitop","nguon-siemens-logo-power"],"nguon-siemens-sitop-psu200m"),
 ("siemens","Cầu chì","cau-chi","Cầu chì ống 3NW · Cầu chì bán dẫn SITOR 3NE",["cau-chi-siemens-3nw","cau-chi-ban-dan-siemens-sitor"],"cau-chi-ban-dan-siemens-sitor"),
 ("siemens","Thiết bị đo","cam-bien-dieu-khien-nhiet","SITRANS P (áp suất) · SITRANS LR (đo mức radar)",["cam-bien-ap-suat-siemens-sitrans-p","cam-bien-muc-radar-siemens"],"cam-bien-ap-suat-siemens-sitrans-p"),

 ("schneider-electric","MCB, MCCB","thiet-bi-dong-cat","MCB Easy9 · MCCB EasyPact EZC",["aptomat-schneider-easy9","mccb-schneider-easypact-ezc"],"mccb-schneider-easypact-ezc"),
 ("schneider-electric","Contactor – Khởi động từ – Rơ le nhiệt","contactor-khoi-dong-tu","TeSys D LC1D · TeSys F LC1F · EasyPact TVS LC1E · CB động cơ GV2 · Rơ le nhiệt LRD",
  ["contactor-schneider-tesys-d","contactor-schneider-tesys-f","contactor-schneider-easypact-tvs","cb-bao-ve-dong-co-schneider-gv2","ro-le-nhiet-schneider-lrd"],"contactor-schneider-tesys-d"),
 ("schneider-electric","Relay – Timer","relay-timer","Relay trung gian Zelio RXM · Timer Zelio RE22 · Relay bảo vệ pha",
  ["relay-trung-gian-schneider-rxm","timer-schneider-zelio-re22","relay-bao-ve-pha-schneider"],"relay-trung-gian-schneider-rxm"),
 ("schneider-electric","Nút nhấn, đèn báo","phu-kien-tu-dien","Harmony XB4 / XB5 · Hộp nút dừng khẩn XAP · Nút nhấn đôi",
  ["nut-nhan-schneider-harmony-xb4","hop-nut-dung-khan-cap-schneider","nut-nhan-doi-schneider-harmony"],"nut-nhan-schneider-harmony-xb4"),
 ("schneider-electric","Cảm biến Telemecanique","cam-bien-dieu-khien-nhiet","Cảm biến quang XUK · Cảm biến siêu âm XX",["cam-bien-quang-telemecanique-xuk","cam-bien-sieu-am-telemecanique"],"cam-bien-quang-telemecanique-xuk"),
 ("schneider-electric","Thiết bị đo","bien-dong-dong-ho-do","Đồng hồ đa năng PowerLogic PM",["dong-ho-da-nang-schneider-pm"],"dong-ho-da-nang-schneider-pm"),

 ("abb","MCB, MCCB","thiet-bi-dong-cat","MCB S200 · MCCB Tmax",["mcb-abb-s200","mccb-abb-tmax"],"mcb-abb-s200"),
 ("abb","Contactor – Rơ le nhiệt","contactor-khoi-dong-tu","Contactor AF · AX · Rơ le nhiệt TA",["contactor-abb-af","contactor-abb-ax","ro-le-nhiet-abb-ta"],"contactor-abb-ax"),
 ("abb","Relay","relay-timer","Relay trung gian CR · Relay giám sát CM",["relay-trung-gian-abb-cr","relay-giam-sat-abb-cm"],"relay-giam-sat-abb-cm"),
 ("abb","Biến tần","bien-tan-khoi-dong-mem","ACS series",["bien-tan-abb-acs"],"bien-tan-abb-acs"),
 ("abb","Cầu chì","cau-chi","Cầu chì NH",["cau-chi-nh-abb"],"cau-chi-nh-abb"),

 ("ifm","Cảm biến tiệm cận","cam-bien-dieu-khien-nhiet","M12 · M30 · cảm biến điện dung",["cam-bien-tiem-can-ifm-m12","cam-bien-tiem-can-ifm-m30","cam-bien-dien-dung-ifm"],"cam-bien-tiem-can-ifm-m30"),
 ("ifm","Cảm biến quang","cam-bien-dieu-khien-nhiet","Cảm biến quang thu phát, phản xạ",["cam-bien-quang-ifm"],"cam-bien-quang-ifm"),
 ("ifm","Cảm biến nhiệt độ, lưu lượng","cam-bien-dieu-khien-nhiet","Cảm biến nhiệt độ · Cảm biến lưu lượng",["cam-bien-nhiet-do-ifm","cam-bien-luu-luong-ifm"],"cam-bien-nhiet-do-ifm"),

 ("autonics","Cảm biến tiệm cận","cam-bien-dieu-khien-nhiet","PR (dạng trụ) · PS (dạng hộp)",["cam-bien-tiem-can-autonics-pr","cam-bien-tiem-can-autonics-ps"],"cam-bien-tiem-can-autonics-pr"),
 ("autonics","Cảm biến quang","cam-bien-dieu-khien-nhiet","BJ · BR",["cam-bien-quang-autonics-bj","cam-bien-quang-autonics-br"],"cam-bien-quang-autonics-br"),
 ("autonics","Encoder","cam-bien-dieu-khien-nhiet","E50S",["encoder-autonics-e50s"],"encoder-autonics-e50s"),
 ("autonics","Bộ nguồn","bo-nguon-ups","SPB",["nguon-autonics-spb"],"nguon-autonics-spb"),

 ("chint","Contactor – Khởi động từ","contactor-khoi-dong-tu","NXC · CJX2 · NC2 · CB động cơ NS2",["contactor-chint-nxc","contactor-chint-cjx2","contactor-chint-nc2","cb-bao-ve-dong-co-chint-ns2"],"contactor-chint-cjx2"),
 ("chint","Relay bảo vệ","relay-timer","Relay bảo vệ pha XJ3",["relay-bao-ve-pha-chint-xj3"],"relay-bao-ve-pha-chint-xj3"),

 ("weidmuller","Bộ nguồn","bo-nguon-ups","PRO eco · PRO top",["nguon-weidmuller-pro-eco","nguon-weidmuller-pro-top"],"nguon-weidmuller-pro-eco"),
 ("weidmuller","Cầu đấu – Relay kèm đế","phu-kien-tu-dien","Cầu đấu dây · Relay kèm đế",["cau-dau-weidmuller","relay-kem-de-weidmuller"],"cau-dau-weidmuller"),
 ("weidmuller","Switch Ethernet","tu-dong-hoa","Switch Ethernet công nghiệp",["switch-ethernet-weidmuller"],"switch-ethernet-weidmuller"),

 ("sick","Cảm biến quang","cam-bien-dieu-khien-nhiet","Cảm biến quang · cảm biến màu · cảm biến nhãn (chữ U)",["cam-bien-quang-sick","cam-bien-mau-sick","cam-bien-nhan-sick"],"cam-bien-quang-sick"),
 ("sick","Cảm biến áp suất","cam-bien-dieu-khien-nhiet","PBS",["cam-bien-ap-suat-sick-pbs"],"cam-bien-ap-suat-sick-pbs"),

 ("phoenix-contact","Bộ nguồn","bo-nguon-ups","QUINT · TRIO · STEP",["nguon-phoenix-contact"],"nguon-phoenix-contact"),
 ("phoenix-contact","Cầu đấu","phu-kien-tu-dien","Cầu đấu dây · cầu đấu dạng cắm",["cau-dau-phoenix-contact","cau-dau-cam-phoenix-contact"],"cau-dau-phoenix-contact"),
 ("phoenix-contact","Switch Ethernet","tu-dong-hoa","Switch Ethernet công nghiệp",["switch-ethernet-phoenix-contact"],"switch-ethernet-phoenix-contact"),

 ("pepperl-fuchs","Cảm biến tiệm cận","cam-bien-dieu-khien-nhiet","Dạng trụ · dạng hộp",["cam-bien-tiem-can-pepperl-fuchs-tru","cam-bien-tiem-can-pepperl-fuchs-vuong"],"cam-bien-tiem-can-pepperl-fuchs-tru"),
 ("pepperl-fuchs","Cảm biến quang","cam-bien-dieu-khien-nhiet","Cảm biến quang",["cam-bien-quang-pepperl-fuchs"],"cam-bien-quang-pepperl-fuchs"),

 ("eaton","Cầu chì Bussmann","cau-chi","NH · bán dẫn · ống 10x38",["cau-chi-nh-eaton-bussmann","cau-chi-ban-dan-eaton-bussmann","cau-chi-ong-10x38-bussmann"],"cau-chi-nh-eaton-bussmann"),
 ("pilz","Thiết bị an toàn","relay-timer","Relay an toàn PNOZ · Công tắc an toàn PSEN",["relay-an-toan-pilz-pnoz","cong-tac-an-toan-pilz-psen"],"relay-an-toan-pilz-pnoz"),
 ("mikro","Bộ điều khiển tụ bù – Relay bảo vệ","tu-bu-cuon-khang","Bộ điều khiển tụ bù PFR · Relay bảo vệ dòng rò",["bo-dieu-khien-tu-bu-mikro","relay-bao-ve-mikro"],"bo-dieu-khien-tu-bu-mikro"),
 ("mitsubishi-electric","Biến tần","bien-tan-khoi-dong-mem","FR-E800",["bien-tan-mitsubishi-fr-e800"],"bien-tan-mitsubishi-fr-e800"),
 ("omron","Cảm biến tiệm cận","cam-bien-dieu-khien-nhiet","E2E",["cam-bien-tiem-can-omron"],"cam-bien-tiem-can-omron"),
 ("festo","Xi lanh khí nén","khi-nen-thuy-luc","DSBC · ADN",["xi-lanh-khi-nen-festo"],"xi-lanh-khi-nen-festo"),
 ("smc","Van điện từ khí nén","khi-nen-thuy-luc","SY · VF",["van-dien-tu-smc"],"van-dien-tu-smc"),

 ("","Nút nhấn – Đèn báo – Công tắc","phu-kien-tu-dien","Đèn báo pha AD16 · Đèn tháp tín hiệu · Công tắc xoay · Công tắc chìa khóa · Hộp nút cầu trục",
  ["den-bao-pha-ad16","den-thap-tin-hieu","cong-tac-xoay","cong-tac-chia-khoa","hop-nut-nhan-cau-truc"],"den-bao-pha-ad16"),
 ("","Tụ bù – Cuộn kháng","tu-bu-cuon-khang","Tụ bù hạ thế · Cuộn kháng lọc sóng hài",["tu-bu-ha-the","cuon-khang-loc-song-hai"],"tu-bu-ha-the"),
 ("","Đế cầu chì","cau-chi","Đế cầu chì gắn ray",["de-cau-chi-gan-ray"],"de-cau-chi-gan-ray"),
 ("","Encoder","cam-bien-dieu-khien-nhiet","Encoder tương đối · tuyệt đối",["encoder-cong-nghiep"],"encoder-cong-nghiep"),
 ("","Motor giảm tốc","motor-hop-giam-toc","Motor giảm tốc cốt thẳng · cốt vuông góc",["motor-giam-toc"],"motor-giam-toc"),
 ("","Van bi inox","phu-kien-duong-ong-van","Van bi inox nối ren, mặt bích",["van-bi-inox"],"van-bi-inox"),
]
