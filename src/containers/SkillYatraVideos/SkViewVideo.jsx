import React from "react";
import CustomIcon from "../../components/CustomIcon";
import { Modal } from "reactstrap";

export default function SkViewVideo({
  video,
  onClose,
  isOpen,
  updateVideoStatus,
}) {
  const {
    _id,
    title,
    link,
    desc,
    status,
    like,
    comment,
    watched,
    favourite,
    categoryId,
    uploadedBy,
  } = video;

  // Fallbacks in case uploadedBy is null
  const userName = uploadedBy ? uploadedBy.userName : "Unknown User";
  const firstName = uploadedBy ? uploadedBy.firstName : "Unknown";
  const surName = uploadedBy ? uploadedBy.surName : "User";
  const profileImage = uploadedBy ? uploadedBy.profileImage : "default-profile.png";

  const getEmbedLink = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };
  
  const embedLink = getEmbedLink(link);
  if (!embedLink) {
    return <div>Invalid video link</div>;
  }
  
  return (
    <Modal backdrop={"static"} isOpen={isOpen} toggle={onClose} centered>
      <div className="view-video modal-contents box-shadow bg-white rounded-lg shadow-lg p-6">
        <div className="video-details">
          <div className="video-header flex justify-between items-center mb-4">
            <div className="title">
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            <div className="icon cursor-pointer" onClick={onClose}>
              <CustomIcon name="IoIosCloseCircleOutline" className="text-2xl" />
            </div>
          </div>
          <div className="video-header flex justify-between items-center mb-4">
            <div className="user-details flex items-center">
              <div className="user-icon mr-4">
                <img src={profileImage} alt="user" className="w-12 h-12 rounded-full" />
              </div>
              <div className="user-names">
                <h5 className="text-lg font-semibold">{firstName} {surName}</h5>
                <h6 className="text-sm text-gray-500">{userName}</h6>
              </div>
            </div>
            <div className={`video-status ${status} text-sm font-semibold px-2 py-1 rounded ${status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {status}
            </div>
          </div>
          <div className="video-body mb-4">
            <iframe
              width="100%"
              height="400"
              src={embedLink}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
            <div className="mt-4">
              <h4 className="text-xl font-semibold mb-2">{title}</h4>
              <p className="text-gray-700">{desc}</p>
            </div>
            <div className="mt-4">
              <h5 className="text-lg font-semibold">Category: {categoryId.name}</h5>
            </div>
            <div className="interactions flex justify-around mt-4">
              <div className="flex items-center">
                <CustomIcon name="FaRegThumbsUp" className="mr-2" />
                <span>{like.length} Likes</span>
              </div>
              <div className="flex items-center text-green-600">
                <CustomIcon name="FaRegCommentAlt" className="mr-2" />
                <span>{comment.length} Comments</span>
              </div>
              <div className="flex items-center text-yellow-600">
                <CustomIcon name="FaRegEye" className="mr-2" />
                <span>{watched.length} Watched</span>
              </div>
              <div className="flex items-center text-red-600">
                <CustomIcon name="FaRegHeart" className="mr-2" />
                <span>{favourite.length} Favourites</span>
              </div>
            </div>
          </div>
          <div className="buttons flex justify-end mt-4">
            <button
              className="button green bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              onClick={() => {
                updateVideoStatus(_id, "Approved");
                onClose();
              }}
            >
              Approve
            </button>
            <button
              className="button red bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                updateVideoStatus(_id, "Rejected");
                onClose();
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}