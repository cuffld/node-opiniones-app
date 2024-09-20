document.querySelectorAll(".post").forEach(post => {
	const postId = post.dataset.postId;
	const ratings = post.querySelectorAll(".post-rating");
	//const likeRating = ratings[0];

	ratings.forEach(rating => {
		const button = rating.querySelector(".post-rating-button");
		const count = rating.querySelector(".post-rating-count");
		button.addEventListener("click", async () => {
			//const count = rating.querySelector(".post-rating-count");
			if (rating.classList.contains("post-rating-selected")) {
				count.textContent = Math.max(0, Number(count.textContent) - 1);
				rating.classList.remove("post-rating-selected");
			}else{
              count.textContent = Number(count.textContent) + 1;
			  rating.classList.add("post-rating-selected");
            }

		  const likeOrUnlike =  rating.classList.contains("post-rating-selected") ? "like" : "unlike";
          const request = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
         };
		  await fetch(`/api/posts/${postId}/${likeOrUnlike}`, request)
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(err => console.log(err))
		});
	});
});
