<?php
declare(strict_types=1);

use Migrations\AbstractMigration;

class CreateArticle extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('article' ,['id' => false]);

        // barcode
        $table->addColumn("barcode", "string", [
            "limit" => 12
        ]);
        // name
        $table->addColumn("name", "string", [
            "limit" => 200,
            "null" => false
        ]);

        // image
        $table->addColumn("image", "string", [
            "limit" => 50,
            "null" => false
        ]);

        // quantity
        $table->addColumn("quantity", "integer", [
            "limit" => 11,
            "null" => false
        ]);

        // adddate
        $table->addColumn("adddate", "timestamp", [
            "default" => 'CURRENT_TIMESTAMP'
        ]);
        // description
        $table->addColumn("description", "string", [
            "limit" => 2000
            
        ]);
        $table->create();
    }
}