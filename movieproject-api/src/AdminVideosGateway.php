<?php

class AdminVideosGateway
{
    private PDO $conn;

    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    public function getAll(int $movieId, int $userId): array
    {
        if (!isset($movieId)) {
            error_log("MovieId is not set or invalid.");
        }
        $sql = "SELECT * FROM videos WHERE movieId = :movieId AND userId = :userId";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":movieId", $movieId, PDO::PARAM_INT);
        $stmt->bindValue(":userId", $userId, PDO::PARAM_INT);
        $stmt->execute();

        $videos = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["official"] = (bool) $row["official"];
            $videos[] = $row;
        }

        return $videos;
    }

    public function get(int $id, int $userId): ?array
    {
        $sql = "SELECT * FROM videos WHERE id = :id AND userId = :userId";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":userId", $userId, PDO::PARAM_INT);
        $stmt->execute();

        $video = $stmt->fetch(PDO::FETCH_ASSOC);
        return $video ?: null;
    }


    public function create(array $data): int
    {
        $sql = "
            INSERT INTO videos (movieId, userId, url, name, site, videoKey, videoType, official) 
            VALUES (:movieId, :userId, :url, :name, :site, :videoKey, :videoType, :official)
        ";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":movieId", $data["movieId"], PDO::PARAM_INT);
        $stmt->bindValue(":userId", $data["userId"], PDO::PARAM_INT);
        $stmt->bindValue(":url", $data["url"], PDO::PARAM_STR);
        $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
        $stmt->bindValue(":site", $data["site"], PDO::PARAM_STR);
        $stmt->bindValue(":videoKey", $data["videoKey"], PDO::PARAM_STR);
        $stmt->bindValue(":videoType", $data["videoType"], PDO::PARAM_STR);
        $stmt->bindValue(":official", $data["official"], PDO::PARAM_BOOL);

        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

    public function update(int $id, array $data): int
    {
        if (!isset($data['movieId'])) {
            throw new Exception("Movie ID is required");
        }
        $sql = "
            UPDATE videos 
            SET movieId = :movieId, url = :url, name = :name, site = :site, 
                videoKey = :videoKey, videoType = :videoType, official = :official
            WHERE id = :id AND userId = :userId
        ";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":movieId", $data["movieId"], PDO::PARAM_INT);
        $stmt->bindValue(":url", $data["url"], PDO::PARAM_STR);
        $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
        $stmt->bindValue(":site", $data["site"], PDO::PARAM_STR);
        $stmt->bindValue(":videoKey", $data["videoKey"], PDO::PARAM_STR);
        $stmt->bindValue(":videoType", $data["videoType"], PDO::PARAM_STR);
        $stmt->bindValue(":official", $data["official"], PDO::PARAM_BOOL);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":userId", $data["userId"], PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->rowCount();
    }

    public function delete(int $id, int $userId): int
    {
        $sql = "DELETE FROM videos WHERE id = :id AND userId = :userId";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":userId", $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount();
    }
}