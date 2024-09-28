import {
    BiSolidCategoryAlt,
    BiSolidMessageRoundedDetail,
  } from "react-icons/bi";
  import { BsBarChartFill } from "react-icons/bs";
  import { CiSearch } from "react-icons/ci";
  import {
    FaCode,
    FaUserCog,
    FaUser,
    FaUserSlash,
    FaStar,
    FaFileAlt,
    FaPeopleArrows,
    FaQuestionCircle,
    FaGlobeAmericas,
    FaAward,
    FaRegAddressCard,
    FaRegEye,
    FaRegPlayCircle,
    FaUserCircle,
    FaRegThumbsUp,
    FaRegCommentAlt,
    FaRegQuestionCircle,
    FaUserTie,
    FaArrowAltCircleDown,
    FaArrowAltCircleUp,
    FaUserCheck,
    FaUserTimes,
  } from "react-icons/fa";
  import {
    FaPlus,
    FaGraduationCap,
    FaIndianRupeeSign,
    FaHandshakeSimple,
    FaBuilding,
    FaTreeCity,
    FaMountainCity,
    FaLocationDot,
    FaHashtag,
    FaRegHeart,
    FaArrowsRotate,
  } from "react-icons/fa6";
  import {
    IoIosArrowUp,
    IoIosCloseCircleOutline,
    IoIosArrowDown,
    IoMdArrowBack,
    IoIosPlay,
    IoIosPause,
    IoMdTimer,
    IoMdPerson,
    IoMdLink,
  } from "react-icons/io";
  import {
    IoNotifications,
    IoChevronBackCircleOutline,
    IoCalendarNumber,
    IoExtensionPuzzle,
    IoShareSocial,
    IoLink,
    IoCaretBack,
    IoCaretForward,
  } from "react-icons/io5";
  import { LiaCloudDownloadAltSolid } from "react-icons/lia";
  import {
    LuBellDot,
    LuMessagesSquare,
    LuImagePlus,
    LuPlaySquare,
  } from "react-icons/lu";
  import {
    MdDashboard,
    MdFeedback,
    MdPolicy,
    MdEmail,
    MdPassword,
    MdUpload,
    MdEdit,
    MdCategory,
    MdContentCopy,
    MdDelete,
    MdOutlineNotes,
    MdOutlineFilterAltOff,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
    MdLockOutline,
  } from "react-icons/md";
  import { PiStudentFill } from "react-icons/pi";
  import {
    PiVideoFill,
    PiFactoryFill,
    PiOfficeChairFill,
    PiFileCsvBold,
  } from "react-icons/pi";
  import { RiUserAddFill } from "react-icons/ri";
  import {
    RiShieldUserFill,
    RiUserSearchFill,
    RiFileTextLine,
    RiAttachment2,
    RiFilter2Line,
  } from "react-icons/ri";
  import { HiX } from "react-icons/hi";
  
  import { GoTasklist } from "react-icons/go";
  import { AiOutlineUsergroupAdd } from "react-icons/ai";
  import { TbUsers } from "react-icons/tb";
  import { TiGroup, TiDeleteOutline } from "react-icons/ti";
  const iconsMap = {
    RiShieldUserFill,
    FaBuilding,
    PiStudentFill,
    GoTasklist,
    RiUserAddFill,
    BsBarChartFill,
    RiFilter2Line,
    FaHashtag,
    FaRegQuestionCircle,
    FaRegCommentAlt,
    FaArrowsRotate,
    MdLockOutline,
    IoLink,
    FaGlobeAmericas,
    FaUserCircle,
    FaLocationDot,
    FaArrowAltCircleUp,
    FaArrowAltCircleDown,
    MdOutlineNotes,
    FaMountainCity,
    FaTreeCity,
    FaUserTie,
    FaIndianRupeeSign,
    FaStar,
    FaFileAlt,
    HiX,
    FaRegThumbsUp,
    MdOutlineFilterAltOff,
    IoIosCloseCircleOutline,
    IoCaretBack,
    IoCaretForward,
    MdDashboard,
    MdDelete,
    MdUpload,
    MdEdit,
    IoExtensionPuzzle,
    RiAttachment2,
    PiFileCsvBold,
    FaRegEye,
    MdCategory,
    IoMdLink,
    IoMdPerson,
    LuMessagesSquare,
    LuImagePlus,
    LuPlaySquare,
    FaRegPlayCircle,
    FaRegAddressCard,
    FaUserCog,
    IoIosPlay,
    AiOutlineUsergroupAdd,
    IoIosPause,
    IoMdArrowBack,
    PiVideoFill,
    MdEmail,
    MdPassword,
    LiaCloudDownloadAltSolid,
    MdFeedback,
    FaAward,
    RiFileTextLine,
    MdPolicy,
    BiSolidCategoryAlt,
    FaQuestionCircle,
    FaHandshakeSimple,
    IoShareSocial,
    RiUserSearchFill,
    IoNotifications,
    CiSearch,
    LuBellDot,
    IoIosArrowUp,
    IoIosArrowDown,
    BiSolidMessageRoundedDetail,
    TiGroup,
    FaPeopleArrows,
    FaPlus,
    FaUserSlash,
    FaUserCheck,
    FaUserTimes,
    TiDeleteOutline,
    MdContentCopy,
    TbUsers,
    IoChevronBackCircleOutline,
    FaCode,
    FaRegHeart,
    FaUser,
    PiFactoryFill,
    IoCalendarNumber,
    PiOfficeChairFill,
    IoMdTimer,
    FaGraduationCap,
    MdKeyboardDoubleArrowRight,
    MdKeyboardDoubleArrowLeft,
  };
  const CustomIcon = ({ name, onClick, tag = "" }) => {
    const IconComponent = iconsMap[name];
  
    return (
      <div className="icon">
        {tag && tag.length > 0 && <span className="icon-tag">{tag}</span>}
        {IconComponent ? (
          <IconComponent onClick={onClick} />
        ) : (
          <div>Icon not found</div>
        )}
      </div>
    );
  };
  
  export default CustomIcon;
  
  