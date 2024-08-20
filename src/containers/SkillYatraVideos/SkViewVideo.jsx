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
    uploadedBy: { userName, firstName, surName, profileImage },
  } = video;
  console.log(video);

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
      <div className="view-video modal-contents box-shadow">
        <div className="video-details">
          <div className="video-header">
            <div className="title">
              <h1>{title}</h1>
            </div>
            <div className="icon" onClick={onClose}>
              <CustomIcon name="IoIosCloseCircleOutline" />
            </div>
          </div>
          <div className="video-header">
            <div className="user-details">
              <div className="user-icon">
                <img src={profileImage} alt="user" />
              </div>
              <div className="user-names">
                <h5>
                  {firstName} {surName}
                </h5>
                <h6>{userName}</h6>
              </div>
            </div>
            <div className={`video-status ${status}`}>{status}</div>
          </div>
          <div className="video-body">
            <iframe
              width="100%"
              height="400"
              src={embedLink}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div>
              <div>
                <h4>{title}</h4>
              </div>
              <div>
                <p>{desc}</p>
              </div>
            </div>
            <div>
              <h5>Category : {categoryId.name}</h5>
            </div>
            <div className="interactions">
              <div>
                <CustomIcon name="FaRegThumbsUp" />
                <span>{like.length} Likes</span>
              </div>
              <div className="green">
                <CustomIcon name="FaRegCommentAlt" />
                <span>{comment.length} Comments</span>
              </div>
              <div className="yellow">
                <CustomIcon name="FaRegEye" />
                <span>{watched.length} Watched</span>
              </div>
              <div className="red">
                <CustomIcon name="FaRegHeart" />
                <span>{favourite.length} Favourites</span>
              </div>
            </div>
          </div>
          <div className="buttons">
            <button
              className="button green"
              onClick={() => {
                updateVideoStatus(_id, "Approved");
                onClose();
              }}
            >
              Approve
            </button>
            <button
              className="button red"
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
