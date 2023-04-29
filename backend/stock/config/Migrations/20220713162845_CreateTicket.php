<?php
declare(strict_types=1);

use Migrations\AbstractMigration;

class CreateTicket extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     * @return void
     */
    public function change()
    {
        $table = $this->table('ticket' ,['id' => true]);


        // ticketid
        $table->addColumn("ticketid", "string", [
            "null" => false ,
        ]);
        // barcode
        $table->addColumn("barcode", "string", [
            "limit" => 12
        ]);
        $table->addColumn("name", "string", [
            "null" => false ,
            "limit" => 200
        ]);
        // unitprice
        $table->addColumn("unitprice", "float", [
            "null" => false
        ]);
        // quantity
        $table->addColumn("quantity", "integer", [
            "limit" => 11,
            "null" => false
        ]);
        // date
        $table->addColumn("date", "timestamp", [
            "default" => 'CURRENT_TIMESTAMP'
        ]);
        $table->create();
    }
}

